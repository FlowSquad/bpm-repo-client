import { makeStyles } from "@material-ui/styles";
import { observer } from "mobx-react";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ArtifactTO, RepositoryTO } from "../../api";
import ArtifactEntry from "../../components/Artifact/ArtifactEntry";
import { ErrorBoundary } from "../../components/Exception/ErrorBoundary";
import { FAVORITE_ARTIFACTS, SYNC_STATUS_FAVORITE } from "../../constants/Constants";
import { fetchFavoriteArtifacts } from "../../store/actions";
import { RootState } from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";

const useStyles = makeStyles(() => ({
    artifactContainer: {
        marginTop: "2rem",
        "&>h1": {
            color: "black",
            fontSize: "1.3rem",
            fontWeight: "normal"
        }
    },
    container: {},
    card: {
        width: "calc(20%)",
        "&:nth-child(5n)>div": {
            marginRight: 0
        }
    }
}));

const FavoriteArtifacts: React.FC = observer(() => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation("common");


    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);
    const syncStatus: boolean = useSelector((state: RootState) => state.dataSynced.favoriteSynced);

    const fetchFavorite = useCallback(() => {
        fetchFavoriteArtifacts().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: FAVORITE_ARTIFACTS, favoriteArtifacts: response.data });
                dispatch({ type: SYNC_STATUS_FAVORITE, dataSynced: true })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchFavorite())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchFavorite())
        })

    }, [dispatch, t]);

    useEffect(() => {
        if (!syncStatus) {
            fetchFavorite();
        }
    }, [syncStatus, fetchFavorite])


    return (
        <div className={classes.artifactContainer}>
            <h1>{t("category.favorite")}</h1>
            <div className={classes.container}>
                <ErrorBoundary>
                    {favoriteArtifacts?.map(artifact => (
                        <ArtifactEntry
                            key={artifact.id}
                            artifact={artifact}
                            favorite={helpers.isFavorite(artifact.id, favoriteArtifacts?.map(artifact => artifact.id))}
                            repository={helpers.getRepoName(artifact.repositoryId, repos)} />
                    ))}
                    {favoriteArtifacts?.length === 0 && (
                        <span>{t("category.noFavoritesAvailable")}</span>
                    )}
                </ErrorBoundary>
            </div>
        </div>
    );
});

export default FavoriteArtifacts;

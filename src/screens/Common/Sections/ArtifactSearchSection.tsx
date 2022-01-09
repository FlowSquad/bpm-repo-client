import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ArtifactApi, ArtifactTO } from "../../../api";
import DefaultFileList from "../../../components/Files/DefaultFileList";
import { FileDescription } from "../../../components/Files/FileListEntry";
import { PopupToast, retryAction } from "../../../components/Form/PopupToast";
import ScreenSectionHeader from "../../../components/Header/ScreenSectionHeader";
import { loadArtifactTypes } from "../../../store/ArtifactTypeState";
import { loadFavoriteArtifacts } from "../../../store/FavoriteArtifactState";
import { loadRepositories } from "../../../store/RepositoryState";
import { RootState } from "../../../store/Store";
import { apiExec, hasFailed } from "../../../util/ApiUtils";

const useStyles = makeStyles({
    fileList: {
        marginBottom: "1rem"
    },
    loading: {
        marginLeft: "1rem"
    }
});

interface Props {
    search: string;
    loadKey: number;
    onChange: () => void;
}

const ArtifactSearchSection: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const { t } = useTranslation("common");

    const searchTimeout = useRef<NodeJS.Timeout | undefined>();

    const repositories = useSelector((state: RootState) => state.repositories);
    const artifactTypes = useSelector((state: RootState) => state.artifactTypes);
    const favoriteArtifacts = useSelector((state: RootState) => state.favoriteArtifacts);

    const [searchError, setSearchError] = useState(false);
    const [searching, setSearching] = useState(false);
    const [found, setFound] = useState<ArtifactTO[]>();

    const search = useCallback(async () => {
        setSearchError(false);
        setSearching(true);
        const response = await apiExec(ArtifactApi, api => api.searchArtifacts(props.search));
        setSearching(false);
        if (hasFailed(response)) {
            setSearchError(true);
            return;
        }

        setFound(response.result);
    }, [props.search]);

    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        setSearching(true);
        searchTimeout.current = setTimeout(search, 1000);
    }, [search, props.search, props.loadKey]);

    useEffect(() => {
        dispatch(loadRepositories());
        dispatch(loadArtifactTypes());
        dispatch(loadFavoriteArtifacts());
    }, [dispatch]);

    // Reload if something changed in the other sections
    useEffect(() => {
        if (props.loadKey > 0) {
            dispatch(loadRepositories(true));
            dispatch(loadArtifactTypes(true));
            dispatch(loadFavoriteArtifacts(true));
        }
    }, [props.loadKey, dispatch]);

    const files: FileDescription[] = useMemo(() => (found || []).map(artifact => ({
        ...artifact,
        favorite: !!favoriteArtifacts.value?.find(a => a.id === artifact.id),
        repository: repositories.value?.find(r => r.id === artifact.repositoryId)
    })), [found, repositories, favoriteArtifacts]);

    if (repositories.error || artifactTypes.error || favoriteArtifacts.error || searchError) {
        return (
            <PopupToast
                message={t("exception.loadingError")}
                action={retryAction(() => {
                    repositories.error && dispatch(loadRepositories(true));
                    artifactTypes.error && dispatch(loadArtifactTypes(true));
                    favoriteArtifacts.error && dispatch(loadFavoriteArtifacts(true));
                    searchError && search();
                })} />
        );
    }

    return (
        <>
            <ScreenSectionHeader title={t("artifact.searchResults")}>
                {searching && (
                    <CircularProgress
                        size={16}
                        variant="indeterminate"
                        className={classes.loading} />
                )}
            </ScreenSectionHeader>
            <DefaultFileList
                files={files}
                reloadFiles={props.onChange}
                className={classes.fileList}
                artifactTypes={artifactTypes.value || []}
                fallback={found === undefined ? "search.running" : "search.notMatching"} />
        </>
    );
};

export default ArtifactSearchSection;

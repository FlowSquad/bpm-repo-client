import {makeStyles} from "@material-ui/styles";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ArtifactTO, ArtifactTypeTO} from "../../../api";
import {fetchArtifactsFromRepo, fetchFavoriteArtifacts} from "../../../store/actions";
import {RootState} from "../../../store/reducers/rootReducer";
import {useParams} from "react-router";
import DropdownButton, {DropdownButtonItem} from "../../../components/Form/DropdownButton";
import {useTranslation} from "react-i18next";
import {List} from "@material-ui/core";
import helpers from "../../../util/helperFunctions";
import ArtifactManagementContainer from "../Buttons/ArtifactManagementContainer";
import ArtifactListItem from "./Holder/ArtifactListItem";
import {
    ACTIVE_ARTIFACTS,
    FAVORITE_ARTIFACTS,
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_FAVORITE
} from "../../../constants/Constants";


const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        marginTop: "15px"
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "0px"
    },
    types: {
        display: "flex",
        flexDirection: "column"
    },
    filter: {
        marginRight: "25px"
    }
}));

const ArtifactDetails: React.FC = (() => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const { repoId } = useParams<{ repoId: string }>();
    const activeArtifacts: Array<ArtifactTO> = useSelector(
        (state: RootState) => state.artifacts.artifacts
    );
    const artifactSynced = useSelector((state: RootState) => state.dataSynced.artifactSynced);
    const favoriteSynced = useSelector((state: RootState) => state.dataSynced.favoriteSynced);
    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes);
    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);

    const [displayedFileTypes, setDisplayedFileTypes] = useState<Array<string>>(fileTypes.map(type => type.name));
    const [filteredArtifacts, setFilteredArtifacts] = useState<Array<ArtifactTO>>(activeArtifacts);
    const [sortValue, setSortValue] = useState<string>("lastEdited");


    const fetchFromRepo = useCallback(async () => {
        fetchArtifactsFromRepo(repoId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                dispatch({ type: ACTIVE_ARTIFACTS, artifacts: response.data });
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: true });
                dispatch({type: SYNC_STATUS_FAVORITE, dataSynced: true})
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchFromRepo())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchFromRepo())
        })
    }, [dispatch, repoId, t])

    const fetchFavorite = useCallback(() => {
        fetchFavoriteArtifacts().then(response => {
            if(Math.floor(response.status / 100) === 2){
                dispatch({ type: FAVORITE_ARTIFACTS, favoriteArtifacts: response.data });
                dispatch({type: SYNC_STATUS_FAVORITE, dataSynced: true})
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchFavorite())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchFavorite())
        })

    }, [dispatch, t]);

    useEffect(() => {
        if (!artifactSynced) {
            fetchFromRepo()
        }
    }, [artifactSynced, repoId, fetchFromRepo]);

    useEffect(() => {
        if (!favoriteSynced) {
            fetchFavorite()
        }
    }, [favoriteSynced, fetchFavorite]);


    const changeFileTypeFilter = (selectedValue: string) => {
        const currentList = displayedFileTypes
        if(displayedFileTypes.find(fileType => fileType === selectedValue)){
            currentList.splice(currentList.indexOf(selectedValue), 1)
        }
        else{
            currentList.push(selectedValue)
        }
        setDisplayedFileTypes(currentList)
        applyFilters()
    }

    //TODO: filteredAndSortedArtifacts ist Alex's vorschlag, um die Sortierfunktion zu vereinfachen
    /*
    const filteredAndSortedArtifacts = useMemo(() => {
        const filtered = activeArtifacts.filter(artifact => displayedFileTypes.indexOf(artifact.fileType) !== -1);
        switch(sortValue) {
            case "created": return filtered.sort(helpers.compareCreated);
            case "lastEdited": return filtered.sort(helpers.compareEdited);
            case "name": return filtered.sort(helpers.compareName);
        }
    }, [activeArtifacts, displayedFileTypes, sortValue]);
*/

    const applyFilters = useCallback(() => {
        const filtered = activeArtifacts.filter(artifact => displayedFileTypes.includes(artifact.fileType))
        sort(sortValue, filtered)
    }, [activeArtifacts, displayedFileTypes, sortValue])

    useEffect(() => {
        applyFilters()
    }, [activeArtifacts, applyFilters])



    const sort = (value: string, artifacts: Array<ArtifactTO>) => {
        switch (value){
            case "created":
                setSortValue("created")
                setFilteredArtifacts(artifacts.sort(helpers.compareCreated));
                return;
            case "lastEdited":
                setSortValue("lastEdited")
                setFilteredArtifacts(artifacts.sort(helpers.compareEdited));
                return;
            case "name":
                setSortValue("name")
                setFilteredArtifacts(artifacts.sort(helpers.compareName));
                return;
        }
    }


    const filterOptions: DropdownButtonItem[] = [];
    fileTypes.map(fileType => (
        filterOptions.push(
            {
                id: fileType.name,
                label: fileType.name,
                type: "button",
                onClick: () => {
                    changeFileTypeFilter(fileType.name)
                }
            }
        )
    ))

    const sortOptions: DropdownButtonItem[] = [
        {
            id: "created",
            label: t("sort.created"),
            type: "button",
            onClick: () => {
                sort("created", filteredArtifacts)
            }
        },
        {
            id: "lastEdited",
            label: t("sort.lastEdited"),
            type: "button",
            onClick: () => {
                sort("lastEdited", filteredArtifacts)
            }
        },
        {
            id: "name",
            label: t("sort.name"),
            type: "button",
            onClick: () => {
                sort("name", filteredArtifacts)

            }
        },
    ]


    return (
        <>
            <div className={classes.buttonContainer}>
                <div >
                    <DropdownButton className={classes.filter} title={t("filter.filter")} options={filterOptions} type={"checkbox"} selectedFilterOptions={displayedFileTypes} />
                    <DropdownButton title={t("sort.sort")} options={sortOptions} type={"radio"} defaultSortValue={"lastEdited"}/>
                </div>
                <ArtifactManagementContainer/>
            </div>

            <div className={classes.container}>
                <List>
                    {filteredArtifacts.map(artifact => (
                        <ArtifactListItem
                            key={artifact.id}
                            artifactTitle={artifact.name}
                            createdDate={artifact.createdDate}
                            updatedDate={artifact.updatedDate}
                            description={artifact.description}
                            repoId={artifact.repositoryId}
                            favorite={helpers.isFavorite(artifact.id, favoriteArtifacts?.map(artifact => artifact.id))}
                            artifactId={artifact.id}
                            fileType={artifact.fileType} />
                    ))}
                </List>
            </div>
        </>
    );
});
export default ArtifactDetails;
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {ArtifactTypeTO} from "../../../api";
import {RootState} from "../../../store/reducers/rootReducer";
import {ListItem} from "@material-ui/core";
import {MoreVert, Star, StarOutline} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import PopupSettings from "../../../components/Form/PopupSettings";
import {DropdownButtonItem} from "../../../components/Form/DropdownButton";
import {addToFavorites, deleteArtifact, getLatestVersion} from "../../../store/actions";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import helpers from "../../../util/helperFunctions";
import {useHistory} from "react-router-dom";
import {openFileInTool} from "../../../util/Redirections";
import CreateVersionDialog from "../../Repository/Artifact/Dialogs/CreateVersionDialog";
import EditArtifactDialog from "../../Repository/Artifact/Dialogs/EditArtifactDialog";
import {SYNC_STATUS_ARTIFACT, SYNC_STATUS_FAVORITE} from "../../../constants/Constants";

const useStyles = makeStyles(() => ({
    listItem: {
        backgroundColor: "white",
        color: "black",
        borderRadius: "2px",
        border: "1px solid lightgrey",
        borderBottom: "none",
        transition: "boxShadow .3s",
        minHeight: "60px",
        maxHeight: "60px",
        fontSize: "1rem",
        "&:nth-last-child(1)": {
            borderBottom: "1px solid lightgrey"
        }
    },
    icons: {
        color: "black",
    },

    contentContainer: {
        width: "100%",
        minHeight: "60px",
        maxHeight: "60px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    leftPanel: {
        minWidth: "50px",
        maxWidth: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    middlePanel: {
        flexGrow: 1,
        display: "flex",
        paddingLeft: "16px",
        flexDirection: "column",
        justifyContent: "space-between",
        alignSelf: "center"
    },
    rightPanel: {
        marginLeft: "16px",
        whiteSpace: "nowrap",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxBlockSize: "1.2rem",
        fontWeight: "bold",
        marginBottom: "0.3rem",
    },
    repository: {
        overflow: "hidden",
        fontSize: "0.9rem",
        textOverflow: "ellipsis",
        maxBlockSize: "1.2rem",
        fontStyle: "italic",
        color: "grey"
    },
    expandIcon: {
        position: "absolute",
        left: "50%",
        bottom: "0px",
        color: "lightgrey"
    },
    collapsible: {
        margin: "0px",
        padding: "0px"
    },
    starPositive: {
        color: "#F5E73D",
        zIndex: 50,
        marginLeft: "10px",
        marginRight: "4px",
        transition: "color .3s",
        "&:hover": {
            color: "white"
        }
    },
    starNegative: {
        color: "lightgrey",
        marginLeft: "10px",
        marginRight: "4px",
        transition: "background-image .3s",
        zIndex: 50,
        "&:hover": {
            color: "#F5E73D",
        }
    },

}));

interface Props {
    artifactTitle: string;
    createdDate: string | undefined;
    updatedDate: string | undefined;
    description: string;
    repoId: string;
    artifactId: string;
    fileType: string;
    favorite: boolean;
    repository: string;
}


const ArtifactListItemRough: React.FC<Props> = ((props: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const ref = useRef<HTMLButtonElement>(null);
    const {t} = useTranslation("common");

    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes);

    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [createVersionOpen, setCreateVersionOpen] = useState<boolean>(false);
    const [editArtifactOpen, setEditArtifactOpen] = useState<boolean>(false);
    const [svgKey, setSvgKey] = useState<string>("");


    useEffect(() => {
        if(fileTypes && props.fileType){
            const svgIcon = fileTypes.find(fileType => fileType.name === props.fileType)?.svgIcon;
            setSvgKey(svgIcon || "");
        }
    }, [fileTypes, props.fileType])


    const handleOpenSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setSettingsOpen(true);
    }

    const setStarred = (event: React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();
        addToFavorites(props.artifactId)
            .then(response => {
                if(Math.floor(response.status / 100) === 2){
                    dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                    dispatch({type: SYNC_STATUS_FAVORITE, dataSynced: false})
                } else {
                    helpers.makeErrorToast(t("artifact.couldNotSetStarred"), () => setStarred(event))
                }
            }, error => {
                helpers.makeErrorToast(t(error.response.data), () => setStarred(event))
            })
    }

    const download = useCallback(async () => {
        getLatestVersion(props.artifactId)
            .then(response => {
                if(Math.floor(response.status / 100) === 2){
                    helpers.download(response.data)
                    helpers.makeSuccessToast(t("download.stated"))
                } else {
                    helpers.makeErrorToast(t(response.data.toString()), () => download())
                }

            }, error => {
                helpers.makeErrorToast(t(error.response.data), () => download())

            })
    }, [props.artifactId, t])

    const options: DropdownButtonItem[] = [

        {
            id: "ShowInRepo",
            label: t("artifact.showInRepo"),
            type: "button",
            onClick: () => {
                history.push(`/repository/${props.repoId}`);
            }
        },
        {
            id: "EditArtifact",
            label: t("artifact.edit"),
            type: "button",
            onClick: () => {
                setEditArtifactOpen(true);
            }
        },
        {
            id: "DownloadArtifact",
            label: t("artifact.download"),
            type: "button",
            onClick: () => {
                download()
            }
        },
        {
            id: "divider1",
            type: "divider",
            label: "",
            onClick: () => { /* Do nothing */
            }
        },
        {
            id: "DeleteArtifact",
            label: t("artifact.delete"),
            type: "button",
            onClick: async () => {
                // eslint-disable-next-line no-restricted-globals
                if (confirm(t("artifact.confirmDelete", {artifactName: props.artifactTitle}))) {
                    try{
                        const [response] = await Promise.all([dispatch(deleteArtifact(props.artifactId))]);
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        if(response?.status === 200) {
                            helpers.makeSuccessToast(t("artifact.deleted"))
                        }
                        else{
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                            helpers.makeErrorToast(t(response.data), () => this())
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        }
    ];
    
    return (
        <>
            <ListItem className={classes.listItem} button onClick={() => openFileInTool(fileTypes, props.fileType, props.repoId, props.artifactId, t("error.missingTool", props.fileType))}>
                <div className={classes.leftPanel}>
                    <Icon className={classes.icons}>{svgKey}</Icon>
                </div>

                <div className={classes.contentContainer}>

                    <div className={classes.middlePanel}>
                        <div className={classes.repository}>
                            {props.repository}
                        </div>
                        <div className={classes.title}>
                            {props.artifactTitle}
                        </div>
                    </div>

                    <div className={classes.rightPanel}>
                        {helpers.reformatDate(props.updatedDate)}
                        {props.favorite ?
                            <Star className={classes.starPositive} onClick={event => setStarred(event)}/>
                            :
                            <StarOutline className={classes.starNegative} onClick={event => setStarred(event)}/>

                        }
                        <IconButton size={"small"} ref={ref} onClick={event => handleOpenSettings(event)} >
                            <MoreVert className={classes.icons}/>
                        </IconButton>
                    </div>
                </div>

            </ListItem>

            <PopupSettings
                open={settingsOpen}
                reference={ref.current}
                onCancel={() => setSettingsOpen(false)}
                options={options} />

            <CreateVersionDialog
                open={createVersionOpen}
                onCancelled={() => setCreateVersionOpen(false)}
                onCreated={() => setCreateVersionOpen(false)}
                artifactId={props.artifactId}
                artifactTitle={props.artifactTitle} />

            <EditArtifactDialog
                open={editArtifactOpen}
                onCancelled={() => setEditArtifactOpen(false)}
                repoId={props.repoId}
                artifactId={props.artifactId}
                artifactName={props.artifactTitle}
                artifactDescription={props.description} />
        </>
    );
})

export default ArtifactListItemRough;
import React, {useRef, useState} from "react";
import {
    ClickAwayListener,
    Grow,
    IconButton,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    TableCell,
    TableRow
} from "@material-ui/core";
import {MoreVert} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";
import {DiagramVersionTO} from "../../api/models";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {downloadVersion} from "../../store/actions";
import theme from "../../theme";
import {DropdownButtonItem} from "../../components/Form/DropdownButton";
import DeployVersionDialog from "./DeployVersionDialog";
import DeploymentHistory from "./DeploymentHistory";
import {fetchTargets} from "../../store/actions/deploymentAction";

const useStyles = makeStyles(() => ({
    splitCell: {
        display: "flex",
        justifyContent: "space-between"
    },
    popupContainer: {
        zIndex: 1000
    },
    menuItem: {
        color: theme.palette.secondary.contrastText,
        fontSize: theme.typography.button.fontSize,
        fontWeight: theme.typography.button.fontWeight,
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
        }
    },
    list: {
        outline: "none"
    },
    more: {
        alignSelf: "flex-end",
        height: "25px",
        width: "25px",
        color: theme.palette.primary.main,
    },
    popup: {
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        backgroundColor: theme.palette.secondary.main,
    },
    deploymentTarget: {
        fontStyle: "italic",
        cursor: "pointer",
        color: theme.palette.primary.dark
    }
}));

interface Props {
    diagramVersion: DiagramVersionTO;
    diagramTitle: string;
}


const VersionItem: React.FC<Props> = ((props: Props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t, i18n} = useTranslation("common");

    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [historyOpen, setHistoryOpen] = useState<boolean>(false);
    const [deployVersionOpen, setDeployVersionOpen] = useState<boolean>(false);
    const ref = useRef<HTMLButtonElement>(null);

    const openModeler = (diagramId: string, versionId?: string) => {
        if (versionId) {
            window.open(`/modeler/#/${diagramId}/${versionId}/`, "_blank");
        } else {
            window.open(`/modeler/#/${diagramId}/latest`, "_blank");
        }
    };

    const reformatDate = (date: string | undefined) => {
        if (date) {
            return date.split("T")[0];
        }
        return "01.01.2000";
    };

    const openSettings = (event: any) => {
        event.stopPropagation();
        setSettingsOpen(true);
    };

    const download = (diagramId: string, versionId: string) => {
        console.log("file Ready - starting download...")
        const path = `/api/version/${diagramId}/${versionId}/download`
        downloadFile(path)
    };

    const downloadFile = (filePath: string) => {
        const link=document.createElement("a");
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
        link.click();
    }

    const openDeploymentHistory = (event: any) => {
        event.stopPropagation();
        setHistoryOpen(true);
    }

    //#todo: find out why clicks go through all the top elements
    const options: DropdownButtonItem[] = [

        {
            id: "DeployVersion",
            label: "version.deploy",
            type: "button",
            onClick: () => {
                dispatch(fetchTargets())
                setDeployVersionOpen(true);

            }
        },
        {
            id: "DownloadVersion",
            label: "version.download",
            type: "button",
            onClick: () => {
                download(props.diagramVersion.diagramId, props.diagramVersion.id);
            }

        },
        {
            id: "DeploymentHistory",
            label: "version.deploymentHistory",
            type: "button",
            onClick: () => {
                setHistoryOpen(true);
            }

        },
    ];
    return (
        <>

            <TableRow
                key={props.diagramVersion.id}
                hover
                onClick={() => openModeler(props.diagramVersion.diagramId, props.diagramVersion.id)}>
                <TableCell
                    component="th"
                    scope="row">
                    <div className={classes.splitCell}>
                        <div>
                            {props.diagramVersion.milestone}
                        </div>
                        {props.diagramVersion.deployments.length > 0 ?
                            <div className={classes.deploymentTarget} onClick={event => openDeploymentHistory(event)}>
                                {props.diagramVersion.deployments[0].target}
                            </div>
                            :
                            <div>

                            </div>}

                    </div>
                </TableCell>
                <TableCell>{props.diagramVersion.comment}</TableCell>
                <TableCell>
                    <div className={classes.splitCell}>

                        <div>
                            {reformatDate(props.diagramVersion.updatedDate)}
                        </div>
                        <IconButton ref={ref} size="small" className={classes.more} onClick={event => openSettings(event)}>
                            <MoreVert/>
                        </IconButton>
                    </div>
                </TableCell>
            </TableRow>


            <Popper
                open={settingsOpen}
                anchorEl={ref.current}
                role={undefined}
                transition
                disablePortal
                className={classes.popupContainer}>
                {({TransitionProps}) => (
                    <Grow
                        {...TransitionProps}
                        style={{transformOrigin: "top"}}>
                        <Paper className={classes.popup}>
                            <ClickAwayListener onClickAway={() => setSettingsOpen(false)}>
                                <MenuList className={classes.list}>
                                    {options.map(option => (
                                        <MenuItem
                                            key={option.id}
                                            disabled={option.disabled || option.type !== "button"}
                                            className={classes.menuItem}
                                            onClick={() => {
                                                if (option.onClick) {
                                                    option.onClick();
                                                } else {
                                                    console.log("Some error when clicking");
                                                }
                                                setSettingsOpen(false);
                                            }}>
                                            {t(option.label)}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>

            <DeployVersionDialog
                open={deployVersionOpen}
                onCancelled={() => setDeployVersionOpen(false)}
                diagramId={props.diagramVersion.diagramId}
                versionId={props.diagramVersion.id}
                versionNumber={props.diagramVersion.milestone} />

            <DeploymentHistory
                versionId={props.diagramVersion.id}
                diagramTitle={props.diagramTitle}
                versionComment={props.diagramVersion.comment}
                milestone={props.diagramVersion.milestone}
                open={historyOpen}
                onCancelled={() => setHistoryOpen(false)}
                deployments={props.diagramVersion.deployments} />

        </>
    )
})
export default VersionItem;
import { makeStyles } from "@material-ui/core/styles";
import { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React, { useCallback, useState } from "react";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {
    SYNC_STATUS_ACTIVE_ENTITY,
    SYNC_STATUS_FAVORITE,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY
} from "../../constants/Constants";
import SettingsTextField from "./Form/SettingsTextField";
import SimpleButton from "./Form/SimpleButton";
import { makeErrorToast, makeSuccessToast } from "../../util/toastUtils";

const useStyles = makeStyles(() => ({
    line: {
        display: "flex",
        flexDirection: "column"
    },
    property: {
        flexBasis: "20px"
    },
    spacer: {
        marginTop: "15px"
    },
    deleteSection: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    applySection: {
        display: "flex",
        justifyContent: "flex-end"
    }
}));

interface Props {
    targetId: string;
    entityName: string;
    entityDescription: string;
    updateEntityMethod: (targetId: string, target: string, description: string) => Promise<AxiosResponse>;
    deleteEntityMethod: (targetId: string) => Promise<AxiosResponse>;
}

const Settings: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const { t } = useTranslation("common");

    const [title, setTitle] = useState<string>(props.entityName);
    const [description, setDescription] = useState<string>(props.entityDescription);

    const applyChanges = useCallback(async () => {
        props.updateEntityMethod(props.targetId, title, description).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                makeSuccessToast(t("repository.updated"));
                dispatch({ type: SYNC_STATUS_ACTIVE_ENTITY, dataSynced: false });
            } else {
                makeErrorToast(t(response.data.toString()), () => applyChanges());
            }
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => applyChanges());
        });
    }, [props, title, description, t, dispatch]);

    const deleteEntity = useCallback(() => {
        if (window.confirm(t("repository.confirmDelete", { repoName: title }))) {
            props.deleteEntityMethod(props.targetId).then(response => {
                if (Math.floor(response.status / 100) === 2) {
                    dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: false });
                    dispatch({ type: SYNC_STATUS_RECENT, dataSynced: false });
                    dispatch({ type: SYNC_STATUS_FAVORITE, dataSynced: false });
                    makeSuccessToast(t("repository.deleted"));
                    history.push("/");
                } else {
                    makeErrorToast(t("repository.couldNotDelete"), () => deleteEntity());
                }
            }, error => {
                makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => deleteEntity());
            });
        }
    }, [t, title, props, dispatch, history]);

    return (
        <>
            <div className={classes.deleteSection}>
                <IconButton onClick={deleteEntity}>
                    <DeleteIcon />
                </IconButton>
            </div>

            <div className={classes.spacer} />

            <SettingsTextField
                label={t("properties.title")}
                value={title}
                onChanged={setTitle} />

            <div className={classes.spacer} />

            <SettingsTextField
                label={t("properties.description")}
                value={description}
                onChanged={setDescription}
                multiline
                minRows={4} />

            <div className={classes.spacer} />
            <div className={classes.spacer} />

            <div className={classes.applySection}>
                <SimpleButton title="Apply" onClick={applyChanges} />
            </div>
        </>
    );
};

export default Settings;

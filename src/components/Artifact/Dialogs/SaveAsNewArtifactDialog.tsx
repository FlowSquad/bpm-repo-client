import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {createArtifact, createMilestone} from "../../../store/actions";
import {
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_MILESTONE,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY
} from "../../../constants/Constants";
import helpers from "../../../util/helperFunctions";
import PopupDialog from "../../Shared/Form/PopupDialog";
import SettingsForm from "../../Shared/Form/SettingsForm";
import SettingsTextField from "../../Shared/Form/SettingsTextField";
import {ArtifactMilestoneUploadTOSaveTypeEnum} from "../../../api";

interface Props {
    open: boolean;
    onCancelled: () => void;
    type: string;
    repoId: string;
    milestoneNo: number;
    file: string;
    artifactId: string;
}

const SaveAsNewArtifactDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const onCreate = useCallback(async () => {
        createArtifact(props.repoId, title, description, props.type).then(response => {
            if(Math.floor(response.status / 100) === 2){
                createMilestone(response.data.id, props.file, ArtifactMilestoneUploadTOSaveTypeEnum.Milestone).then(response => {
                    if(Math.floor(response.status / 100) === 2){
                        dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                        dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: false})
                        dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
                        dispatch({type: SYNC_STATUS_MILESTONE, dataSynced: false});
                    } else {
                        helpers.makeErrorToast(t(response.data.toString()), () => createMilestone(response.data.id, props.file, ArtifactMilestoneUploadTOSaveTypeEnum.Milestone))
                    }
                }, error => {
                    helpers.makeErrorToast(t(error.response.data), () => createMilestone(response.data.id, props.file, ArtifactMilestoneUploadTOSaveTypeEnum.Milestone))
                })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => onCreate())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => onCreate())
        })

    }, [props.repoId, props.type, props.file, title, description, dispatch, t]);


    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("milestone.saveMilestoneXAsNewArtifact", {milestone: props.milestoneNo})}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={onCreate} >

            <SettingsForm large>

                <SettingsTextField
                    label={t("properties.title")}
                    value={title}
                    onChanged={setTitle}/>

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    minRows={3}
                    maxRows={3}
                    onChanged={setDescription}/>

            </SettingsForm>
        </PopupDialog>
    );
};
export default SaveAsNewArtifactDialog;

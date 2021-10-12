import MenuItem from "@material-ui/core/MenuItem";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {ArtifactMilestoneUploadTOSaveTypeEnum, RepositoryTO} from "../../../api";
import {RootState} from "../../../store/reducers/rootReducer";
import {createArtifact} from "../../../store/actions";
import {
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_MILESTONE,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY
} from "../../../constants/Constants";
import helpers from "../../../util/helperFunctions";
import PopupDialog from "../Form/PopupDialog";
import SettingsForm from "../Form/SettingsForm";
import SettingsSelect from "../Form/SettingsSelect";
import SettingsTextField from "../Form/SettingsTextField";
import {createMilestone} from "../../../store/actions/milestoneAction";

interface Props {
    open: boolean;
    onCancelled: () => void;
    type: string;
    repo?: RepositoryTO;
}

const CreateArtifactDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [repoId, setRepoId] = useState<string>(props.repo?.id ? props.repo.id : "");

    useEffect(() => {
        setRepoId(props.repo?.id ? props.repo.id : "");
    }, [props.repo]);

    const allRepos: Array<RepositoryTO> = useSelector(
        (state: RootState) => state.repos.repos
    );

    const onCreate = useCallback(async () => {
        createArtifact(repoId, title, description, props.type)
            .then(response => {
                if (Math.floor(response.status / 100) === 2) {
                    createMilestone(response.data.id, "", ArtifactMilestoneUploadTOSaveTypeEnum.Milestone)
                        .then(response2 => {
                            if (Math.floor(response2.status / 100) === 2) {
                                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                                dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: false });
                                dispatch({ type: SYNC_STATUS_RECENT, dataSynced: false })
                                dispatch({ type: SYNC_STATUS_MILESTONE, dataSynced: false });
                                setTitle("");
                                setDescription("");
                                helpers.makeSuccessToast(t("artifact.created"));
                                props.onCancelled();
                            } else {
                                helpers.makeErrorToast(response2.data.toString(), () => createMilestone(response.data.id, "", ArtifactMilestoneUploadTOSaveTypeEnum.Milestone))
                            }
                        }, error => {
                            helpers.makeErrorToast(t(error.response.data), () => createMilestone(response.data.id, "", ArtifactMilestoneUploadTOSaveTypeEnum.Milestone))
                        })
                } else {
                    helpers.makeErrorToast(t(response.data.toString()), () => onCreate())
                }
            }, error => {
                helpers.makeErrorToast(t(error.response.data), () => onCreate())

            })
    }, [props, dispatch, repoId, title, description, t]);


    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t(`artifact.create${props.type}`)}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={onCreate}>

            <SettingsForm large>

                <SettingsSelect
                    disabled={false}
                    value={repoId}
                    label={t("repository.target")}
                    onChanged={setRepoId}>
                    {props.repo
                        ? (
                            <MenuItem
                                key={props.repo?.id}
                                value={props.repo?.id}
                                selected>
                                {props.repo?.name}
                            </MenuItem>
                        )
                        : allRepos?.map(repo => (
                            <MenuItem
                                key={repo.id}
                                value={repo.id}>
                                {repo.name}
                            </MenuItem>
                        ))}
                </SettingsSelect>

                <SettingsTextField
                    label={t("properties.title")}
                    value={title}
                    onChanged={setTitle} />

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    minRows={3}
                    maxRows={3}
                    onChanged={setDescription} />

            </SettingsForm>
        </PopupDialog>
    );
};
export default CreateArtifactDialog;

import MenuItem from "@material-ui/core/MenuItem";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {RepositoryTO} from "../../api";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsSelect from "../../components/Form/SettingsSelect";
import {RootState} from "../../store/reducers/rootReducer";
import {useTranslation} from "react-i18next";
import {copyToRepo, fetchRepositories} from "../../store/actions";
import helpers from "../../util/helperFunctions";
import {REPOSITORIES, SYNC_STATUS_REPOSITORY} from "../../constants/Constants";

interface Props {
    open: boolean;
    onCancelled: () => void;
    name: string
    artifactId: string;
}

const CopyToRepoDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [error, setError] = useState<string | undefined>(undefined);
    const [repoId, setRepoId] = useState<string>("");

    const allRepos: Array<RepositoryTO> = useSelector(
        (state: RootState) => state.repos.repos
    );
    const repoSynced: boolean = useSelector((state: RootState) => state.dataSynced.repoSynced)

    const onCopy = useCallback(async () => {
        copyToRepo(repoId, props.artifactId).then(response => {
            if(Math.floor(response.status / 100) === 2) {
                helpers.makeSuccessToast(t("repo.copied"))
                setRepoId("")
                props.onCancelled();
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => onCopy())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => onCopy())
        })
    }, [repoId, props, t]);

    const fetchRepos = useCallback(() => {
        fetchRepositories().then(response => {
            if(Math.floor(response.status / 100) === 2){
                dispatch({ type: REPOSITORIES, repos: response.data });
                dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: true });
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchRepos())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchRepos())
        })
    }, [dispatch, t]);

    useEffect(() => {
        if(!repoSynced){
            fetchRepos()
        }
    }, [fetchRepos, repoSynced])

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("artifact.copy", {artifactName: props.name})}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}
            firstTitle={t("dialog.copy")}
            onFirst={onCopy} >

            <SettingsForm large>

                <SettingsSelect
                    disabled={false}
                    value={repoId}
                    label={t("repoId.target")}
                    onChanged={setRepoId}>
                    {allRepos?.map(repo => (
                        <MenuItem
                            key={repo.id}
                            value={repo.id}>
                            {repo.name}
                        </MenuItem>
                    ))}
                </SettingsSelect>

            </SettingsForm>
        </PopupDialog>
    );
};
export default CopyToRepoDialog;

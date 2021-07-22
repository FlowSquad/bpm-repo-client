import MenuItem from "@material-ui/core/MenuItem";
import React, {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {RepositoryTO} from "../../api/models";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsSelect from "../../components/Form/SettingsSelect";
import SettingsTextField from "../../components/Form/SettingsTextField";
import * as diagramAction from "../../store/actions/diagramAction";
import {RootState} from "../../store/reducers/rootReducer";
import {useTranslation} from "react-i18next";

interface Props {
    open: boolean;
    onCancelled: () => void;
    type: "bpmn" | "dmn";
    repo?: RepositoryTO;
}

const CreateDiagramDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [repository, setRepository] = useState<string>(props.repo ? props.repo.id : "");

    const allRepos: Array<RepositoryTO> = useSelector(
        (state: RootState) => state.repos.repos
    );


    const onCreate = useCallback(async () => {
        setRepository(props.repo?.id)
        try {
            dispatch(diagramAction.createDiagramWithDefaultVersion(props.repo?.id ? props.repo.id : repository, title, description,props.type));
            props.onCancelled();
        } catch (err) {
            console.log(err);
        }
    }, [dispatch, repository, title, description, props]);


    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={props.type === "bpmn" ? t("diagram.createBpmn") : t("diagram.createDmn")}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={onCreate}
            firstDisabled={title === "" || repository === ""} >

            <SettingsForm large>

                <SettingsSelect
                    disabled={false}
                    value={props.repo ? props.repo.id : repository}
                    label={t("repository.target")}
                    onChanged={setRepository}>
                    {props.repo
                        ? (
                            <MenuItem
                                key={props.repo?.id}
                                value={props.repo?.id}>
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
                    onChanged={setTitle}/>

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    rows={3}
                    rowsMax={3}
                    onChanged={setDescription}/>

            </SettingsForm>
        </PopupDialog>
    );
};
export default CreateDiagramDialog;

import {makeStyles} from "@material-ui/core/styles";
import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsSelect from "../../components/Form/SettingsSelect";
import SettingsTextField from "../../components/Form/SettingsTextField";
import {DiagramTO, DiagramVersionUploadTOSaveTypeEnum, RepositoryTO} from "../../api/models";
import {useDispatch, useSelector} from "react-redux";
import * as diagramAction from "../../store/actions/diagramAction";
import {UNHANDLEDERROR} from "../../store/constants";
import * as versionAction from "../../store/actions/versionAction";
import MenuItem from "@material-ui/core/MenuItem";
import {RootState} from "../../store/reducers/rootReducer";
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles(() => ({
    input: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        marginBottom: "12px"
    }
}));

interface Props {
    open: boolean;
    onCancelled: () => void;
    repo?: RepositoryTO;
}

const UploadDiagramDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();


    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [repository, setRepository] = useState<string>(props.repo ? props.repo.id : "");
    const [file, setFile] = useState<string>("");

    const allRepos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos)
    const uploadedDiagram: DiagramTO = useSelector((state: RootState) => state.uploadedDiagram.uploadedDiagram)


    useEffect(() => {
        if (uploadedDiagram) {
            dispatch(versionAction.createOrUpdateVersion(uploadedDiagram.id, file, DiagramVersionUploadTOSaveTypeEnum.RELEASE))
        }
    }, [dispatch, uploadedDiagram, file])

    useEffect(() => {
        setRepository(props.repo?.id)
    }, [props.repo])

    const onCreate = useCallback(async () => {
        try {
            dispatch(diagramAction.uploadDiagram(repository, title, description))
            props.onCancelled()
        } catch (err) {
            dispatch({type: UNHANDLEDERROR, errorMessage: err});
        }
    }, [title, description, repository, dispatch]);


    const onFileChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {target: {files}} = e;
        if (files != null && files.length > 0) {
            const file = files[0];
            const fileExtension = file.name.substring(file.name.lastIndexOf("."), file.name.length)
            if (fileExtension != ".bpmn") {
                dispatch({type: UNHANDLEDERROR, errorMessage: "File must be of type .bpmn"})
            }
            const reader = new FileReader();
            reader.addEventListener("load", (event: ProgressEvent<FileReader>) => {
                if (typeof event.target?.result === "string") {
                    setFile(event.target?.result);
                }
            });
            reader.readAsText(file);
        }
    }, []);

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title="Upload Diagram File"
            secondTitle="Cancel"
            onSecond={props.onCancelled}
            firstTitle="Create"
            onFirst={onCreate}>

            <SettingsForm large>

                <input
                    className={classes.input}
                    accept=".bpmn,.dmn"
                    type="file"
                    name="file"
                    onChange={onFileChanged}/>

                <SettingsSelect
                    disabled={false}
                    value={props.repo ? props.repo.id : repository}
                    label="Target Repository"
                    onChanged={setRepository}>
                    {props.repo ?
                        <MenuItem
                            key={props.repo?.id}
                            value={props.repo?.id}>
                            {props.repo?.name}
                        </MenuItem>
                        :
                        allRepos?.map(repo => (
                            <MenuItem
                                key={repo.id}
                                value={repo.id}>
                                {repo.name}
                            </MenuItem>
                        ))
                    }


                </SettingsSelect>

                <SettingsTextField
                    label="Title"
                    value={title}
                    onChanged={setTitle}/>

                <SettingsTextField
                    label="Description"
                    value={description}
                    multiline
                    rows={3}
                    rowsMax={3}
                    onChanged={setDescription}/>

            </SettingsForm>
        </PopupDialog>
    );
};

export default UploadDiagramDialog;

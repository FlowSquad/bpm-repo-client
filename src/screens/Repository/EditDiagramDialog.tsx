import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Input, InputLabel } from "@material-ui/core";
import * as diagramAction from "../../store/actions/diagramAction";
import PopupDialog from "../../components/Form/PopupDialog";

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
    }

}));

interface Props {
    open: boolean;
    onCancelled: () => void;
    repoId: string;
    diagramId: string;
    diagramName: string;
    diagramDescription: string;
}

const EditDiagramDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState<string>(props.diagramName);
    const [description, setDescription] = useState<string>(props.diagramDescription);

    const applyChanges = useCallback(async () => {
        try {
            dispatch(diagramAction.updateDiagram(title, description, props.diagramId));
            props.onCancelled();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [title, description, props, dispatch]);

    return (
        <PopupDialog
            open={props.open}
            title={props.diagramName}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle="Apply Changes"
            onFirst={applyChanges}
            secondTitle="Close"
            onSecond={props.onCancelled}>
            <InputLabel style={{ fontSize: "12px" }} htmlFor="Title">Title</InputLabel>
            <Input
                id="Name"
                value={title}
                onChange={event => setTitle(event.target.value)} />
            <div className={classes.spacer} />
            <InputLabel style={{ fontSize: "12px" }} htmlFor="Description">Description</InputLabel>
            <Input
                id="Description"
                value={description}
                multiline
                rows={4}
                onChange={event => setDescription(event.target.value)} />

        </PopupDialog>
    );
};

export default EditDiagramDialog;

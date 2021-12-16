import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import MenuItem from "@material-ui/core/MenuItem";
import { RootState } from "../../../store/reducers/rootReducer";
import { deployMilestone } from "../../../store/actions";
import { SYNC_STATUS_MILESTONE } from "../../../constants/Constants";
import PopupDialog from "../../Shared/Form/PopupDialog";
import SettingsSelect from "../../Shared/Form/SettingsSelect";
import { makeErrorToast, makeSuccessToast } from "../../../util/toastUtils";

interface Props {
    repositoryId: string;
    artifactId: string;
    milestoneId: string;
    open: boolean;
    milestoneNumber: number;
    onCancelled: () => void
}

const DeployMilestoneDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const targets: Array<string> = useSelector((state: RootState) => state.deployment.targets);

    const [error, setError] = useState<string | undefined>(undefined);
    const [target, setTarget] = useState<string>("");

    useEffect(() => {
        targets.sort();
    }, [targets]);

    const deploy = useCallback(async () => {
        deployMilestone(target, props.repositoryId, props.artifactId, props.milestoneId).then(response => {
            if (Math.floor(response.status / 100) !== 2) {
                makeErrorToast(t(response.data.toString()), () => deploy());
                return;
            }
            dispatch({ type: SYNC_STATUS_MILESTONE, dataSynced: false });
            makeSuccessToast(t("milestone.deployed"));
            props.onCancelled();
        }, err => {
            makeErrorToast(t(typeof err.response.data === "string" ? err.response.data : err.response.data.error), () => deploy());
        });
    }, [target, props, dispatch, t]);

    return (
        <PopupDialog
            open={props.open}
            title={t("deployment.dialogHeader", { milestoneNumber: props.milestoneNumber })}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle={t("dialog.applyChanges")}
            onFirst={deploy}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}>

            <SettingsSelect
                disabled={false}
                required
                value={target}
                label={t("properties.target")}
                onChanged={setTarget}>
                {targets.map(singleTarget => (
                    <MenuItem
                        key={singleTarget}
                        value={singleTarget}>
                        {singleTarget}
                    </MenuItem>
                ))}

            </SettingsSelect>
        </PopupDialog>
    );
};

export default DeployMilestoneDialog;

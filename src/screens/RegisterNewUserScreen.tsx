import React, {useCallback, useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import LockIcon from "@material-ui/icons/Lock";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {UserApi} from "../api/api";
import {useTranslation} from "react-i18next";
import {getClientConfig} from "../api/config";
import {makeErrorToast} from "../util/toastUtils";

const useStyles = makeStyles(theme => ({
    createUserProfilePage: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    createUserProfileContent: {
        width: "100%",
        maxWidth: "960px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: "30px",
        paddingRight: "30px",
        paddingTop: "20vh",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "deeppink"
    },
    infoText: {
        textAlign: "center",
        fontSize: "15px",
        width: "100%",
        maxWidth: "500px",
    },
    form: {
        width: "100%",
        maxWidth: "500px",
        marginTop: theme.spacing(3),
    },
    confirmationCheckbox: {
        marginTop: "15px",
    },
    createUserProfileButton: {
        marginTop: "25px",
        marginBottom: "50px",
        backgroundColor: "#0bb538",
    },
}));

/**
 * Creates a FlowRepo User profile
 * if a User with a given oAuth key does not have one yet.
 */
const RegisterNewUserScreen: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const {t} = useTranslation("common");

    const [userController] = useState<UserApi>(new UserApi());

    /**
     * Persist a new User-profile in the FlowRepo-backend
     */
    const handleCreateUserProfile = useCallback(async (): Promise<void> => {
        try {
            const config = getClientConfig();
            await userController.createUser(config);
            history.push("/");
        } catch (response) {
            makeErrorToast("Could not persist the new User", () => handleCreateUserProfile());
        }
    }, [history, userController]);

    return (
        <div className={classes.createUserProfilePage}>
            <div className={classes.createUserProfileContent}>
                <Avatar className={classes.avatar}>
                    <LockIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    {t("registration.signup")}
                </Typography>

                <p className={classes.infoText}>
                    {t("registration.firstTime")}
                    <br/>
                    {t("registration.accountRequired")}
                </p>

                <form className={classes.form} noValidate>


                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        //disabled={isButtonDisabled}
                        className={classes.createUserProfileButton}
                        onClick={handleCreateUserProfile}>

                        {t("registration.create")}
                    </Button>
                </form>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default RegisterNewUserScreen;
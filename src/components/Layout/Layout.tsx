import {useAuth0} from "@auth0/auth0-react";
import {CircularProgress, makeStyles} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import Menu from "./Menu";
import Router from "./Router";
import {UserControllerApi} from "../../api/api";
import RegisterNewUserScreen from "../../screens/RegisterNewUserScreen";
import helpers from "../../constants/Functions";
import {toast, ToastContainer} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import RepoCard from "../../screens/Overview/Holder/RepoCard";
import {CURRENT_USER_INFO, HANDLEDERROR, SUCCESS} from "../../store/actions/diagramAction";
import Toast from "./Toast";

const useStyles = makeStyles(() => ({
    contentWrapper: {
        flexGrow: 1,
        display: "flex",
        paddingLeft: "65px"
    },
    content: {
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        maxHeight: "calc(100vh - 60px)",
        padding: "40px 16px",
        maxWidth: "1232px",
        margin: "0 auto"
    },
    loadingScreen: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        width: "100%",
        paddingTop: "40vh",
    },
    loadingCircle: {
        color: "green",
    }
}));

/**
 * Diese Komponente erzeugt das Layout auf oberster Ebene der Anwendung.
 * Es enthält sowohl das Menü als auch sämtlichen Inhalt der Anwendung. + Toasts für Fehlgeschlagene bzw. erfolgreiche API calls
 * Die primäre Aufgabe des Layouts ist die einheitliche Darstellung des
 * globalen Menüs sowie das Routing.
 *
 * Die Komponente bietet keine Anpassungsmöglichkeiten und besitzt
 * keine Parameter.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = (): any => {



    const dispatch = useDispatch()
    const apiErrorState: string = useSelector((state: RootState) => state.api.errorMessage)
    const apiErrorRetryMethod: () => void = useSelector((state: RootState) => state.api.retryMethod)
    const apiSuccessState: string = useSelector((state: RootState) => state.api.successMessage)


    //#TODO: Add a retry Button to the toast
    useEffect(() => {
        if(apiErrorState){
            //toast can contain any component, the Retry Button (and the message: apiErrorState) has to be passed here
            //toast.error(<Toast errorMessage={apiErrorState} retryMethod={apiErrorRetryMethod}/>, {autoClose: 8000, pauseOnHover: true, role: "alert"})
            toast.error(apiErrorState, {autoClose: 8000, pauseOnHover: true})
            dispatch({type: HANDLEDERROR, errorMessage: ""})
        }
        if(apiSuccessState){
            toast.success(apiSuccessState, {autoClose: 4000, pauseOnHover: true})
            dispatch({type: SUCCESS, successMessage: ""})
        }
    }, [apiErrorState, apiSuccessState, apiErrorRetryMethod, dispatch])

    const classes = useStyles();
    const [userController] = useState<UserControllerApi>(new UserControllerApi());


    //const [securityIsOn, setSecurityIsOn] = useState<boolean>(true);
    const [initializing, setInitializing] = useState<boolean>(false);
    const [initialized, setInitialized] = useState<boolean>(false);
    const [userDoesExist, setUserDoesExist] = useState<boolean>(false);
    const {
        loginWithRedirect,
        isAuthenticated,
        isLoading,
        error,
        getAccessTokenSilently
    } = useAuth0();


    useEffect(() => {
        if (isAuthenticated && initialized) {
            const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
            userController.getUserInfo(config)
                .then((response) => {
                    if(response.data) {
                        setUserDoesExist(true)
                        dispatch({type: CURRENT_USER_INFO, currentUserInfo: response.data})
                    } else {
                        setUserDoesExist(false);
                    }

                })
                .catch(() => setUserDoesExist(false));
        }


    }, [isAuthenticated, initialized, userController]);



    if (isLoading) {
        return (
            <div className={classes.loadingScreen}>
                <h1>Developer Platform it@M</h1>
                <CircularProgress className={classes.loadingCircle} />
            </div>
        );
    }

    if (error) {
        return <div>Oops... {error.message}</div>;
    }

    if (!isAuthenticated) {
        return loginWithRedirect();
    }

    if (!initialized) {
        if (!initializing) {
            setInitializing(true);
            getAccessTokenSilently().then((token) => {
                localStorage.setItem("oauth_token", "Bearer " + token)

            });
            setInitialized(true)
            setInitializing(false)
        }
        //return null;
    }



    if(!userDoesExist){
        return <RegisterNewUserScreen/>
    }

    return (
        <>
            <Menu />
            <div className={classes.contentWrapper}>
                <div className={classes.content}>
                    <Router />
                    <ToastContainer />
                </div>
            </div>
        </>
    );
};

export default Layout;

import {Drawer} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {BarChart, Brush, FormatShapes, Help, Home, Widgets} from "@material-ui/icons";
import React, {useCallback, useRef, useState} from "react";
import MenuSpacer from "../../Menu/MenuSpacer";
import DrawerApp from "./AppMenu/DrawerApp";


const useStyles = makeStyles((theme) => ({
    button: {
        textTransform: "none",
        fontFamily: "Arial",
        fontSize: "0.9rem",
        margin: "0 0.5rem",
        minWidth: 0,
        height: "28px",
        width: "28px",
        color: "white"
    },
    activeButton: {
        color: "black"
    },
    hiddenTitle: {
        display: "none"
    },
    drawerPaper: {
        marginTop: "56px",
        boxShadow: theme.shadows[24],
        width: "65px",
        padding: "0px",
        height: "calc(100% - 56px)",
        background: theme.palette.primary.main,
        overflow: "hidden",
        transition: "width .3s",
        border: "none",
        "&:hover": {
            width: "400px"
        }
    },

    drawerBackdrop: {
        backgroundColor: "rgba(0, 0, 0, 0)"
    },
    drawerTitle: {
        margin: "2.5rem 13px 0 13px",
        fontSize: "1.5rem",
        fontWeight: 600,

    },
    drawerSubtitle: {
        margin: "0.5rem 13px 1.5rem 13px",
        fontSize: "1.2rem",
        fontWeight: 300
    },
    drawerContent: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1
    }

}));

const AppMenu: React.FC = () => {
    const classes = useStyles();

    const [open, setOpen] = useState(true);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const handleClose = useCallback((event: React.MouseEvent<EventTarget>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    }, []);

    return (
        <>


            <Drawer
                classes={{paper: classes.drawerPaper}}
                variant="permanent"
                BackdropProps={{
                    className: classes.drawerBackdrop
                }}
                anchor="left"
                open={open}
                onClose={handleClose}>


                <div className={classes.drawerContent}>

                    <DrawerApp
                        active
                        title="Home"
                        onClick={() => window.open("/", "_self")}
                        icon={Home}/>

                    <DrawerApp
                        title="Modeler"
                        onClick={() => window.open("/modeler/", "_self")}
                        icon={Brush}/>

                    <DrawerApp
                        title="Forms"
                        onClick={() => window.open("localhost:8082/", "_blank")}
                        icon={FormatShapes}/>

                    <DrawerApp
                        title="Building Blocks"
                        onClick={() => window.open("/blocks/ui/", "_self")}
                        icon={Widgets}/>

                    <DrawerApp
                        title="FlowCov"
                        onClick={() => window.open("https://flowcov.miragon.cloud/", "_self")}
                        icon={BarChart}/>

                    <MenuSpacer/>

                    <DrawerApp
                        dense
                        title="Contact Support"
                        description="info@flowsquad.io"
                        icon={Help}/>

                    {/*<DrawerApp*/}
                    {/*    dense*/}
                    {/*    title="Your Account"*/}
                    {/*    description={user.email}*/}
                    {/*    icon={AccountCircle} />*/}

                    {/*<DrawerApp*/}
                    {/*    dense*/}
                    {/*    title="Sign Out"*/}
                    {/*    onClick={logout}*/}
                    {/*    icon={ExitToApp} />*/}

                </div>

            </Drawer>
        </>
    );
};

export default AppMenu;

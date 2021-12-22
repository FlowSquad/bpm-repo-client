import { makeStyles, Theme } from "@material-ui/core/styles";
import {
    FolderOutlined,
    HomeOutlined,
    ScheduleOutlined,
    SettingsOutlined,
    StarOutlineOutlined
} from "@material-ui/icons";
import i18next from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducers/rootReducer";
import { THEME } from "../../../theme";
import MenuAvatar from "./MenuAvatar";
import MenuAvatarPopup from "./MenuAvatarPopup";
import MenuItem from "./MenuItem";
import MenuLanguage from "./MenuLanguage";
import MenuLanguagePopup from "./MenuLanguagePopup";
import MenuSpacer from "./MenuSpacer";

const useStyles = makeStyles((theme: Theme) => ({
    menuBar: {
        display: "flex",
        height: "100vh",
        backgroundColor: THEME.menu.background,
        flexDirection: "column",
        width: "96px",
        padding: "4rem 0 1rem 0"
    }
}));

const Menu: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const currentUser = useSelector((state: RootState) => state.user.currentUserInfo)

    return (
        <div className={classes.menuBar}>
            <MenuItem
                exact
                href="/"
                text={t("menu.home")}
                icon={HomeOutlined} />
            <MenuItem
                href="/projects"
                text={t("menu.projects")}
                icon={FolderOutlined} />
            <MenuItem
                href="/favorites"
                text={t("menu.favorites")}
                icon={StarOutlineOutlined} />
            <MenuItem
                href="/recent"
                text={t("menu.recents")}
                icon={ScheduleOutlined} />
            <MenuItem
                href="/settings"
                text={t("menu.settings")}
                icon={SettingsOutlined} />
            <MenuSpacer />
            <MenuLanguage>
                {({ close }) => (
                    <MenuLanguagePopup onClose={close} />
                )}
            </MenuLanguage>
            <MenuAvatar name={currentUser?.username}>
                {({ close }) => (
                    <MenuAvatarPopup
                        onClose={close}
                        user={currentUser} />
                )}
            </MenuAvatar>
        </div>
    );
};

export default Menu;

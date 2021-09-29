import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/styles";
import theme from "../../theme";
import {RepositoryTO, TeamTO} from "../../api";
import React, {useState} from "react";
import Section from "../../components/Layout/Section";
import {Settings} from "@material-ui/icons";
import {AxiosResponse} from "axios";
import PopupSettings from "./Form/PopupSettings";
import UserManagementDialog from "./Dialogs/UserManagementDialog";
import EditEntityDialog from "./Dialogs/EditEntityDialog";
import {DropdownButtonItem} from "./Form/DropdownButton";


const useStyles = makeStyles(() => ({
    description: {
        fontStyle: "italic",
        color: theme.palette.text.secondary,
        fontSize: "1rem",
        paddingBottom: "1rem"
    }
}))

interface Props {
    targetId: string;
    entity: "repository" | "team";
    object: TeamTO | RepositoryTO;
    fetchAssignedUsersMethod: (targetId: string) => Promise<AxiosResponse>;
    createAssignmentMethod: (targetId: string, userId: string, username: string, role: any) => Promise<AxiosResponse>;
    updateAssignmentMethod: (targetId: string, userId: string, userName: string, role: any) => Promise<AxiosResponse>;
    deleteAssignmentMethod: (targetId: string, userName: string) => Promise<AxiosResponse>;
    updateEntityMethod: (targetId: string, title: string, description: string) => Promise<AxiosResponse>;
    deleteEntityMethod: (targetId: string) => Promise<AxiosResponse>;
}


const Details: React.FC<Props> = (props => {
    const { t } = useTranslation("common");
    const classes = useStyles();

    const [overflowTarget, setOverflowTarget] = useState<Element>();
    const [userManagementOpen, setUserManagementOpen] = useState(false);
    const [repoManagementOpen, setRepoManagementOpen] = useState(false);

    const options: DropdownButtonItem[] = [
        {
            id: "UserManagement",
            label: t("options.editUsers"),
            type: "button",
            onClick: () => setUserManagementOpen(true)
        },
        {
            id: "RepoManagement",
            label: t("repository.edit"),
            type: "button",
            onClick: () => setRepoManagementOpen(true)
        }
    ]



    return (
        <Section
            title={props.object.name}
            actions={[{
                onClick: event => setOverflowTarget(event.currentTarget),
                icon: <Settings />
            }]}>
            <div className={classes.description}>
                {props.object.description}
            </div>

            <PopupSettings
                open={!!overflowTarget}
                reference={overflowTarget || null}
                onCancel={() => setOverflowTarget(undefined)}
                options={options} />

            <UserManagementDialog
                open={userManagementOpen}
                onCancelled={() => setUserManagementOpen(false)}
                targetId={props.targetId}
                fetchAssignedUsersMethod={props.fetchAssignedUsersMethod}
                deleteAssignmentMethod={props.deleteAssignmentMethod}
                updateAssignmentMethod={props.updateAssignmentMethod}
                createAssignmentMethod={props.createAssignmentMethod}
                entity={props.entity} />


            <EditEntityDialog
                open={repoManagementOpen}
                onCancelled={() => setRepoManagementOpen(false)}
                targetId={props.object.id}
                repoName={props.object.name}
                repoDescription={props.object.description}
                deleteEntityMethod={props.deleteEntityMethod}
                updateEntityMethod={props.updateEntityMethod} />

        </Section>
    )
})

export default Details;
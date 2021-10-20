import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import AddSharingSearchBar from "./AddSharingSearchBar";
import SharedRepositories from "./SharedRepositories";
import {Tab} from "@material-ui/core";
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {ArtifactTO, RepositoryTO, ShareWithRepositoryTORoleEnum} from "../../../api";
import {getManageableRepos, searchRepos} from "../../../store/actions";
import {SYNC_STATUS_SHARED} from "../../../constants/Constants";
import helpers from "../../../util/helperFunctions";
import PopupDialog from "../../Shared/Form/PopupDialog";
import {
    getSharedRepos, getSharedTeams,
    shareWithRepo,
    shareWithTeam,
    unshareWithRepo,
    updateShareWithRepo
} from "../../../store/actions/shareAction";
import {searchTeam} from "../../../store/actions/teamAction";


const useStyles = makeStyles((theme: Theme) => ({

    tab: {
        flexGrow: 1,
    }

}));


interface Props {
    open: boolean;
    onCancelled: () => void;
    artifact: ArtifactTO | undefined;
}

const SharingManagementDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation("common");

    const [error, setError] = useState<string | undefined>(undefined);
    const [openedTab, setOpenedTab] = useState<string>("team");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [manageableRepos, setManageableRepos] = useState<RepositoryTO[]>([]);


    //TODO:  GetManageable verwenden, um die möglichen Aktionen des users auf eigene Repos zu beschränken
    const getManageable = useCallback(async () => {
        getManageableRepos().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                setManageableRepos(response.data)
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getManageable())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getManageable())
        })
    }, [t])



    const handleChangeTab = (event: any, newValue: string) => {
        setOpenedTab(newValue)
        dispatch({ type: SYNC_STATUS_SHARED, sharedSynced: false })

    }

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("artifact.share", { artifactName: props.artifact?.name })}
            firstTitle={t("dialog.close")}
            onFirst={() => props.onCancelled()}>
            
            
            {props.artifact && (
                <>
                    <TabContext value={openedTab} >

                        <TabList onChange={handleChangeTab} >
                            <Tab label={t("repository.repositories")} value="repository" className={classes.tab}/>
                            <Tab label={t("team.teams")} value="team" className={classes.tab}/>
                        </TabList>

                        <TabPanel value="repository">
                            <AddSharingSearchBar
                                entity="repository"
                                repositoryId={props.artifact.repositoryId}
                                artifactId={props.artifact.id}
                                roleForNewAssignments={ShareWithRepositoryTORoleEnum.Viewer}
                                searchMethod={searchRepos}
                                shareMethod={shareWithRepo}/>
                            <SharedRepositories
                                entity={"repository"}
                                artifact={props.artifact}
                                getSharedMethod={getSharedRepos}
                                unshareMethod={unshareWithRepo}
                                updateMethod={updateShareWithRepo}/>
                        </TabPanel>

                        <TabPanel value="team">
                            <AddSharingSearchBar
                                entity="repository"
                                repositoryId={props.artifact.repositoryId}
                                artifactId={props.artifact.id}
                                roleForNewAssignments={ShareWithRepositoryTORoleEnum.Viewer}
                                searchMethod={searchTeam}
                                shareMethod={shareWithTeam}/>
                            <SharedRepositories
                                entity={"repository"}
                                artifact={props.artifact}
                                getSharedMethod={getSharedTeams}
                                unshareMethod={unshareWithRepo}
                                updateMethod={updateShareWithRepo}/>
                        </TabPanel>



                    </TabContext>

                </>
            )}

        </PopupDialog>
    );
};
export default SharingManagementDialog;



//TODO Add this tab when Teams return

/*
                        <TabPanel value="1">
                            <AddSharingSearchBar
                                entity="team"
                                repositoryId={props.artifact.repositoryId}
                                artifactId={props.artifact.id}
                                roleForNewAssignments={ShareWithTeamTORoleEnum.Viewer}
                                searchMethod={searchTeam}
                                shareMethod={shareWithTeam}/>
                            <SharedRepositories
                                entity={"team"}
                                artifact={props.artifact}
                                getSharedMethod={getSharedTeams}
                                unshareMethod={unshareWithTeam}
                                updateMethod={updateShareWithTeam}/>
                        </TabPanel>
 */
import {makeStyles} from "@material-ui/core/styles";
import {observer} from "mobx-react";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {ArtifactTypeTO} from "../../api";
import {createTeam} from "../../store/actions/teamAction";
import {createRepository} from "../../store/actions";
import {SYNC_STATUS_REPOSITORY, SYNC_STATUS_TEAM} from "../../constants/Constants";
import DropdownButton, {DropdownButtonItem} from "./Form/DropdownButton";
import {RootState} from "../../store/reducers/rootReducer";
import ArtifactSearchBar from "../../screens/Overview/ArtifactSearchBar";
import SimpleButton from "./Form/SimpleButton";
import CreateTitleDescDialog from "./Dialogs/CreateTitleDescDialog";
import CreateArtifactDialog from "./Dialogs/CreateArtifactDialog";
import UploadArtifactDialog from "./Dialogs/UploadArtifactDialog";
import Identity from "./Identity";

const useStyles = makeStyles(() => ({
    container: {
        paddingTop: "16px",
        display: "flex",
        justifyContent: "space-between",
        whiteSpace: "nowrap"
    },
    button: {
        minWidth: "100px",
        marginLeft: "1rem"
    }
}));

const HeaderContainer: React.FC = observer(() => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const [createRepoOpen, setCreateRepoOpen] = useState(false);
    const [uploadArtifactOpen, setUploadArtifactOpen] = useState(false);
    const [createArtifactOpen, setCreateArtifactOpen] = useState(false);
    const [createTeamOpen, setCreateTeamOpen] = useState(false);
    const [createArtifactType, setCreateArtifactType] = useState("BPMN");
    const [artifactOptions, setArtifactOptions] = useState<DropdownButtonItem[]>([])

    const fileTypes: ArtifactTypeTO[] = useSelector((state: RootState) => state.artifacts.fileTypes);


    useEffect(() => {
        const opts: DropdownButtonItem[] = []

        opts.push({
            id: "createRepo",
            label: "repository.create",
            type: "button",
            onClick: () => setCreateRepoOpen(true)
        });
        opts.push({
            id: "createTeam",
            label: "team.create",
            type: "button",
            onClick: () => setCreateTeamOpen(true)
        });

        opts.push({
            id: "divider1",
            type: "divider",
            label: ""
        });

        fileTypes?.forEach(fileType => {
            opts.push({
                id: fileType.name,
                label: `artifact.create${fileType.name}`,
                type: "button",
                onClick: () => {
                    setCreateArtifactOpen(true);
                    setCreateArtifactType(fileType.name)
                }
            });
        });
        opts.push({
            id: "divider2",
            type: "divider",
            label: ""
        });
        opts.push({
            id: "upload",
            label: "artifact.upload",
            type: "button",
            onClick: () => setUploadArtifactOpen(true)
        });

        setArtifactOptions(opts);
    }, [fileTypes])

    return (
        <>
            <div className={classes.container}>
                <div>
                    <Identity />
                </div>

                <ArtifactSearchBar />
                <div>
                    <DropdownButton
                        type={"default"}
                        className={classes.button}
                        title={t("action.createNew")}
                        options={artifactOptions} />
                </div>
            </div>

            <CreateTitleDescDialog
                open={createRepoOpen}
                onCancelled={() => setCreateRepoOpen(false)}
                successMessage={t("repository.created")}
                title={t("repository.create")}
                createMethod={createRepository}
                dataSyncedType={SYNC_STATUS_REPOSITORY}/>

            <CreateTitleDescDialog
                open={createTeamOpen}
                onCancelled={() => setCreateTeamOpen(false)}
                successMessage={t("team.created")}
                title={t("team.create")}
                createMethod={createTeam}
                dataSyncedType={SYNC_STATUS_TEAM}/>

            <CreateArtifactDialog
                open={createArtifactOpen}
                type={createArtifactType}
                onCancelled={() => setCreateArtifactOpen(false)} />

            <UploadArtifactDialog
                open={uploadArtifactOpen}
                onCancelled={() => setUploadArtifactOpen(false)} />
        </>
    );
});

export default HeaderContainer;

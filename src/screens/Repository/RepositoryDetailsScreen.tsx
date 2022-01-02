import {
    CloudUploadOutlined,
    FormatShapesOutlined,
    NoteAddOutlined,
    PeopleAltOutlined,
    SettingsOutlined,
    TuneOutlined
} from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "../../components/Exception/ErrorBoundary";
import ContentLayout from "../../components/Layout/ContentLayout";
import ScreenHeader from "../../components/Layout/Header/ScreenHeader";
import ScreenSectionHeader from "../../components/Layout/Header/ScreenSectionHeader";
import { loadArtifactTypes } from "../../store/ArtifactTypeState";
import { loadRecentArtifacts } from "../../store/RecentArtifactState";
import { loadRepositories } from "../../store/RepositoryState";
import { RootState } from "../../store/Store";
import CreateArtifactDialog from "../Common/CreateArtifactDialog";
import UploadArtifactDialog from "../Common/UploadArtifactDialog";
import FilesSection from "./Sections/FilesSection";

const ADD_OPTIONS = [
    [
        {
            label: "artifact.createBPMN",
            value: "create-bpmn",
            icon: NoteAddOutlined
        },
        {
            label: "artifact.createDMN",
            value: "create-dmn",
            icon: NoteAddOutlined
        },
        {
            label: "artifact.createFORM",
            value: "create-form",
            icon: FormatShapesOutlined
        },
        {
            label: "artifact.createCONFIGURATION",
            value: "create-configuration",
            icon: TuneOutlined
        }
    ],
    [
        {
            label: "artifact.upload",
            value: "upload-file",
            icon: CloudUploadOutlined
        }
    ]
];

const MENU_OPTIONS = [
    [
        {
            label: "repository.editUsers",
            value: "members",
            icon: PeopleAltOutlined
        },
        {
            label: "repository.settings",
            value: "settings",
            icon: SettingsOutlined
        }
    ]
];

interface Params {
    repositoryId: string;
}

const RepositoryDetailsScreen: React.FC = (() => {
    const history = useHistory();
    const dispatch = useDispatch();
    const params = useParams<Params>();

    const repositories = useSelector((state: RootState) => state.repositories);
    const artifactTypes = useSelector((state: RootState) => state.artifactTypes);

    const [loadKey, setLoadKey] = useState(0);
    const [search, setSearch] = useState("");
    const [uploadArtifactDialogOpen, setUploadArtifactDialogOpen] = useState(false);
    const [createArtifactType, setCreateArtifactType] = useState("");

    useEffect(() => {
        dispatch(loadRepositories());
        dispatch(loadArtifactTypes());
    }, [dispatch]);

    const onAddItemClicked = useCallback((action: string) => {
        switch (action) {
            case "create-bpmn": {
                setCreateArtifactType("BPMN");
                break;
            }
            case "create-dmn": {
                setCreateArtifactType("DMN");
                break;
            }
            case "create-form": {
                setCreateArtifactType("FORM");
                break;
            }
            case "create-configuration": {
                setCreateArtifactType("CONFIGURATION");
                break;
            }
            case "upload-file": {
                setUploadArtifactDialogOpen(true);
                break;
            }
        }
    }, []);

    const onMenuItemClicked = useCallback((action: string) => {
        switch (action) {
            default: {
                break;
            }
        }
    }, []);

    const reload = useCallback(() => setLoadKey(cur => cur + 1), []);

    const repository = repositories.value?.find(r => r.id === params.repositoryId);

    return (
        <>
            <ErrorBoundary>
                <ScreenHeader
                    onSearch={setSearch}
                    onAdd={onAddItemClicked}
                    onMenu={onMenuItemClicked}
                    title={[
                        { title: "Alle Projekte", link: "/repositories" },
                        {
                            title: repository?.name ?? "Unbekannt",
                            link: "/repositories/" + repository?.id
                        }
                    ]}
                    addOptions={ADD_OPTIONS}
                    menuOptions={MENU_OPTIONS}
                    primary="add" />
            </ErrorBoundary>

            <ContentLayout>
                <ErrorBoundary>
                    <FilesSection
                        search={search}
                        loadKey={loadKey}
                        onChange={reload}
                        repositoryId={params.repositoryId} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <ScreenSectionHeader title="Mit diesem Projekt geteilt" />
                    Test
                </ErrorBoundary>
            </ContentLayout>

            <ErrorBoundary>
                <CreateArtifactDialog
                    repositoryId={params.repositoryId}
                    repositories={repositories.value || []}
                    open={!!createArtifactType}
                    type={createArtifactType}
                    onClose={result => {
                        setCreateArtifactType("");
                        // TODO: Open file screen here
                        result && history.push(`/repository/${result.repositoryId}/${result.artifactId}`);
                    }} />

                <UploadArtifactDialog
                    open={uploadArtifactDialogOpen}
                    repositoryId={params.repositoryId}
                    onClose={result => {
                        setUploadArtifactDialogOpen(false);
                        if (result) {
                            // TODO: Open milestone screen here
                            history.push(`/repository/${result.repositoryId}/${result.artifactId}/milestone/${result.milestone}`);
                            // Update state
                            dispatch(loadRepositories(true));
                            dispatch(loadRecentArtifacts(true));
                        }
                    }}
                    repositories={repositories.value || []}
                    artifactTypes={artifactTypes.value || []} />
            </ErrorBoundary>
        </>
    );
});

export default RepositoryDetailsScreen;

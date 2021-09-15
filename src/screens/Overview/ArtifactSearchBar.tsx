import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ArtifactTO, RepositoryTO } from "../../api";
import { ErrorBoundary } from "../../components/Exception/ErrorBoundary";
import { ARTIFACTQUERY_EXECUTED, SEARCHED_ARTIFACTS } from "../../constants/Constants";
import { searchArtifact } from "../../store/actions";
import { RootState } from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";
import OverviewArtifactList from "./OverviewArtifactList";

const useStyles = makeStyles(() => ({
    headerText: {
        color: "black",
        fontSize: "20px"
    },
    container: {
        minWidth: "400px",
        maxWidth: "1000px",
        flexGrow: 2
    },
    resultsContainer: {
        marginTop: "15px",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap"
    },
}));

let timeout: NodeJS.Timeout | undefined;

const ArtifactSearchBar: React.FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation("common");


    const searchedArtifacts: Array<ArtifactTO> = useSelector(
        (state: RootState) => state.artifacts.searchedArtifacts
    );
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);
    const foundDiagrams: number = useSelector((state: RootState) => state.resultsCount.artifactResultsCount);
    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);


    const [artifact, setArtifact] = useState("");
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState<ArtifactTO[]>([]);
    const [displayResult, setDisplayResult] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!open) {
            setResults([]);
        }
        if (open) {
            setResults(searchedArtifacts);
        }
    }, [open, searchedArtifacts, artifact, displayResult]);

    useEffect(() => {
        if (searchedArtifacts.length > 0) {
            setLoading(false);
        }
        if (foundDiagrams === 0) {
            setLoading(false);
        }
    }, [searchedArtifacts, foundDiagrams]);

    useEffect(() => {
        if (artifact === "") {
            setDisplayResult(false);
            setLoading(false);
        }
    }, [artifact]);


    const onChangeWithTimer = ((input: string) => {
        setArtifact(input);
        if (input === "") {
            setDisplayResult(false);
        } else {
            setDisplayResult(true);
        }
        if (input !== "") {
            if (timeout) {
                clearTimeout(timeout);
            }
            setLoading(true);
            timeout = setTimeout(() => fetchArtifactSuggestion(input), 500);
        }
    });

    const fetchArtifactSuggestion = useCallback((input: string) => {
        searchArtifact(input).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SEARCHED_ARTIFACTS, searchedArtifacts: response.data });
                dispatch({
                    type: ARTIFACTQUERY_EXECUTED,
                    artifactResultsCount: response.data.length
                })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchArtifactSuggestion(input))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchArtifactSuggestion(input))

        })
    }, [dispatch, t]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateState = (event: any) => {
        onChangeWithTimer(event.target.textContent)
        setArtifact(event.target.textContent);
        setDisplayResult(true);
    };


    return (
        <>
            <div className={classes.container}>
                <ErrorBoundary>
                    <Autocomplete
                        size="small"
                        id="ArtifactSearchBar"
                        freeSolo
                        style={{ width: "100%" }}
                        open={false}
                        onOpen={() => setOpen(false)}
                        onClose={() => setOpen(false)}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={option => `${option.name}`}
                        onChange={updateState}
                        options={results}
                        loading={loading}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={t("search.search")}
                                variant="outlined"
                                onChange={event => onChangeWithTimer(event.target.value)}
                                value={artifact}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loading && artifact !== "" && (
                                                <CircularProgress
                                                    color="inherit"
                                                    size={20} />
                                            )}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }} />
                        )} />
                    {displayResult && !loading && (
                        <div className={classes.resultsContainer}>
                            <OverviewArtifactList
                                fallback="search.noResults"
                                artifacts={searchedArtifacts}
                                repositories={repos}
                                favorites={favoriteArtifacts} />
                        </div>
                    )}
                </ErrorBoundary>
            </div>
        </>
    );
};

export default ArtifactSearchBar;

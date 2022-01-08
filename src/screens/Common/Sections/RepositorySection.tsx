import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ScreenSectionHeader from "../../../components/Header/ScreenSectionHeader";
import Pagination from "../../../components/List/Pagination";
import RepositoryCard from "../../../components/Repositories/RepositoryCard";
import { loadRepositories } from "../../../store/RepositoryState";
import { usePagination } from "../../../components/List/usePagination";
import { RootState } from "../../../store/Store";
import { openRepository } from "../../../util/LinkUtils";
import { searchAllCaseInsensitive } from "../../../util/SearchUtils";
import { sortByString } from "../../../util/SortUtils";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "1rem"
    },
    content: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        margin: "0 -0.5rem 1rem -0.5rem"
    },
    fallback: {
        margin: "0.5rem",
        fontSize: "0.9rem",
        fontWeight: 300
    }
}));

interface Props {
    search: string;
    loadKey: number;
    pageSize?: number;
    onChange: () => void;
    hideWhenNoneFound?: boolean;
}

const RepositorySection: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();

    const { t } = useTranslation("common");

    const repositories = useSelector((state: RootState) => state.repositories);
    const filtered = useMemo(() => {
        return sortByString((repositories.value || []).filter(repo => (
            searchAllCaseInsensitive(props.search, repo.name, repo.description)
        )), repository => repository.name);
    }, [props.search, repositories]);

    const { pageItems, paginationConfig } = usePagination(filtered, props.pageSize ?? 6);

    useEffect(() => {
        dispatch(loadRepositories());
    }, [dispatch]);

    // Reload if something changed in the other sections
    useEffect(() => {
        if (props.loadKey > 0) {
            dispatch(loadRepositories(true));
        }
    }, [dispatch, props.loadKey]);

    if (props.hideWhenNoneFound !== false && props.search && filtered.length === 0) {
        return null;
    }

    return (
        <>
            <ScreenSectionHeader title={props.search ? "Projekte" : "Alle Projekte"} />
            <div className={classes.root}>
                <div className={classes.content}>
                    {pageItems.map(repo => (
                        <RepositoryCard
                            key={repo.id}
                            repository={repo}
                            onClick={() => history.push(openRepository(repo.id))} />
                    ))}
                    {filtered.length === 0 && (
                        <Typography
                            variant="body1"
                            className={classes.fallback}>
                            {t("repository.notAvailable")}
                        </Typography>
                    )}
                </div>
                <Pagination config={paginationConfig} />
            </div>
        </>
    );
};

export default RepositorySection;

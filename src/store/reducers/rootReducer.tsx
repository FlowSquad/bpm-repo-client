import {combineReducers} from "@reduxjs/toolkit";
import diagramReducer from "./recentDiagramsReducer";
import repoReducer from "./repositoriesReducer";
import favoriteDiagramReducer from "./favoriteDiagramsReducer"
import uploadDiagramReducer from "./uploadDiagramReducer";
import apiResponseReducer from "./apiResponseReducer";
import dataSyncedReducer from "./dataSyncedReducer";
import activeRepoReducer from "./activeRepoReducer";
import activeDiagramsReducer from "./activeDiagramsReducer";
import versionsReducer from "./versionsReducer";
import apiResponseWithRetryReducer from "./apiResponseWithRetryReducer";
import assignedUsersReducer from "./assignedUsersReducer";
import currentUserReducer from "./currentUserReducer";
import searchedUsers from "../reducers/usersReducer";
import resultsCount from "../reducers/userResultsReducer";

export const rootReducer = combineReducers({
    recentDiagrams: diagramReducer,
    favoriteDiagrams: favoriteDiagramReducer,
    repos: repoReducer,
    uploadedDiagram: uploadDiagramReducer,
    api: apiResponseReducer,
    apiWithRetry: apiResponseWithRetryReducer,
    dataSynced: dataSyncedReducer,
    activeRepo: activeRepoReducer,
    activeDiagrams: activeDiagramsReducer,
    versions: versionsReducer,
    assignedUsers: assignedUsersReducer,
    currentUserInfo: currentUserReducer,
    searchedUsers: searchedUsers,
    resultsCount: resultsCount
})

export type RootState = ReturnType<typeof rootReducer>
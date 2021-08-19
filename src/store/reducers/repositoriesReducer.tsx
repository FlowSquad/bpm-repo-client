import {CaseReducer} from "@reduxjs/toolkit";
import {RepositoryTO} from "../../api";
import {ACTIVE_REPO, MANAGEABLE_REPOS, REPOSITORIES, SHARED_REPOS} from "../../constants/Constants";

const initialState = {
    repos: Array<RepositoryTO>(),
    activeRepo: null,
    manageableRepos: Array<RepositoryTO>(),
    sharedRepos: Array<RepositoryTO>()
};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case REPOSITORIES:
            return {
                ...state,
                repos: action.repos
            };
        case ACTIVE_REPO:
            return {
                ...state,
                activeRepo: action.activeRepo
            };
        case MANAGEABLE_REPOS:
            return {
                ...state,
                manageableRepos: action.manageableRepos
            }
        case SHARED_REPOS:
            return {
                ...state,
                sharedRepos: action.sharedRepos
            }
    }
    return state;
};

export default reducer;

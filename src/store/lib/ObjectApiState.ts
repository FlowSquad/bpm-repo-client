import {
    ActionCreatorWithoutPayload,
    ActionCreatorWithPayload,
    createSlice,
    Draft,
    PayloadAction,
    SliceCaseReducers
} from "@reduxjs/toolkit";
import { ApiResponse, FailedResponse, hasFailed, SuccessfulResponse } from "../../util/ApiUtils";
import type { RootDispatch, RootState } from "../Store";
import {
    ApiState,
    LoadFailed,
    LoadFailedPayload,
    LoadStarted,
    LoadSuccessfulPayload,
    reduceLoadFailed,
    reduceLoadStarted
} from "./ApiState";

export interface ObjectApiState<Type> extends ApiState {
    readonly value: Type | undefined;
}

export interface ObjectLoadSuccessfulPayload<Type> extends LoadSuccessfulPayload {
    value: Type;
}

export interface ObjectUpdateStatePayload<Type> {
    value: Type;
}

const ObjectLoadSucceeded = "ObjectLoadSucceeded";
const ObjectUpdateState = "ObjectUpdateState";

const createInitialObjectApiState = <T>(name: string): ObjectApiState<T> => ({
    initialLoading: false,
    loading: false,
    name: name,
    value: undefined
});

const reduceObjectLoadSucceeded = <Type>(
    draft: Draft<ObjectApiState<Type>>,
    action: PayloadAction<ObjectLoadSuccessfulPayload<Type>>
) => {
    draft.loading = false;
    draft.initialLoading = false;
    draft.statusCode = action.payload.statusCode;
    draft.loadTime = new Date().getTime();
    draft.error = undefined;
    draft.value = action.payload.value as Draft<Type>;
};

const reduceObjectUpdateState = <Type>(
    draft: Draft<ObjectApiState<Type>>,
    action: PayloadAction<ObjectUpdateStatePayload<Type>>
) => {
    draft.value = action.payload.value as Draft<Type>;
};

const getObjectSliceState = <Type>(
    state: RootState,
    sliceName: string
): ObjectApiState<Type> | undefined => (
    Object.values(state).find(slice => slice?.name === sliceName) as
        ObjectApiState<Type> | undefined
);

declare type ErrorHandler<Type> = (
    response: FailedResponse,
    loadFailed: (payload: LoadFailedPayload) => void,
    loadSucceeded: (payload: ObjectLoadSuccessfulPayload<Type>) => void
) => boolean;

declare type ObjectBaseOptions = {
    name: string,
    cacheTimeout: number
};

declare type ObjectDefaultOptions<Type> = ObjectBaseOptions & {
    execute: () => Promise<ApiResponse<Type>>;
    onError?: ErrorHandler<Type>;
};

declare type ObjectCustomOptions<Type, Response> = ObjectBaseOptions & {
    execute: () => Promise<ApiResponse<Response>>;
    transform: (response: Response) => Type;
    onError?: ErrorHandler<Type>;
};

declare type ObjectOptions<Type, Response> =
    | ObjectDefaultOptions<Type>
    | ObjectCustomOptions<Type, Response>;

const isCustomObjectResponse = <Type, Response>(
    param: ObjectOptions<Type, Response>
): param is ObjectCustomOptions<Type, Response> => (
    (!!(param as ObjectCustomOptions<Type, Response>).transform)
);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createObjectApiState = <Type, Response = Type>(options: ObjectOptions<Type, Response>) => {
    const loadStartedAction = options.name + LoadStarted;
    const loadFailedAction = options.name + LoadFailed;
    const loadSucceededAction = options.name + ObjectLoadSucceeded;
    const updateStateAction = options.name + ObjectUpdateState;

    const slice = createSlice<ObjectApiState<Type>, SliceCaseReducers<ObjectApiState<Type>>, typeof options.name>({
        name: options.name,
        initialState: createInitialObjectApiState(options.name) as ObjectApiState<Type>,
        reducers: {
            [loadStartedAction]: reduceLoadStarted,
            [loadFailedAction]: reduceLoadFailed,
            [loadSucceededAction]: reduceObjectLoadSucceeded,
            [updateStateAction]: reduceObjectUpdateState
        }
    });

    // TODO Why is the unknown conversion needed?
    const loadStarted = slice.actions[loadStartedAction] as
        unknown as ActionCreatorWithoutPayload;

    const loadFailed = slice.actions[loadFailedAction] as
        ActionCreatorWithPayload<LoadFailedPayload>;

    const loadSucceeded = slice.actions[loadSucceededAction] as
        ActionCreatorWithPayload<ObjectLoadSuccessfulPayload<Type>>;

    const updateState = slice.actions[updateStateAction] as
        unknown as ActionCreatorWithPayload<ObjectUpdateStatePayload<Type>>;

    const load = (forceLoad = false) => async (
        dispatch: RootDispatch,
        getState: () => RootState
    ): Promise<void> => {
        const state = getObjectSliceState<Type>(getState(), options.name);

        if (!state) {
            throw new Error(`The list slice with name ${options.name} does not exist! Did you `
                + "you forget to add it to the root store?");
        }

        if (!forceLoad) {
            const loadTime = state?.loadTime || 0;
            const maxAge = new Date().getTime() - options.cacheTimeout * 1000;
            if (loadTime > maxAge) {
                return;
            }
        }

        dispatch(loadStarted());
        try {
            const result = await options.execute();
            if (hasFailed(result)) {
                const wasHandled = options.onError && options.onError(
                    result,
                    payload => dispatch(loadFailed(payload)),
                    payload => dispatch(loadSucceeded(payload))
                );

                if (!wasHandled) {
                    dispatch(loadFailed({
                        error: result.error,
                        statusCode: result.status
                    }));
                }
            } else {
                let transformed: Type;
                if (isCustomObjectResponse(options)) {
                    const typedResult = result as SuccessfulResponse<Response>;
                    transformed = options.transform(typedResult.result);
                } else {
                    const typedResult = result as SuccessfulResponse<Type>;
                    transformed = typedResult.result;
                }
                dispatch(loadSucceeded({
                    value: transformed,
                    statusCode: result.status
                }));
            }
        } catch (error: any) {
            const wasHandled = options.onError && options.onError(
                error,
                payload => dispatch(loadFailed(payload)),
                payload => dispatch(loadSucceeded(payload))
            );

            if (!wasHandled) {
                dispatch(loadFailed({
                    error: error.message,
                    statusCode: 0
                }));
            }
        }
    };

    return [slice, load, updateState] as [typeof slice, typeof load, typeof updateState];
};

export default createObjectApiState;

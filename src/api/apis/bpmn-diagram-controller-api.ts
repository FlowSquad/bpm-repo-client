/* tslint:disable */
/* eslint-disable */
/**
 * OpenAPI definition
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { BpmnDiagramSVGUploadTO } from '../models';
import { BpmnDiagramTO } from '../models';
import { BpmnDiagramUploadTO } from '../models';
/**
 * BpmnDiagramControllerApi - axios parameter creator
 * @export
 */
export const BpmnDiagramControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {BpmnDiagramUploadTO} body 
         * @param {string} bpmnRepositoryId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createOrUpdateDiagram: async (body: BpmnDiagramUploadTO, bpmnRepositoryId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling createOrUpdateDiagram.');
            }
            // verify required parameter 'bpmnRepositoryId' is not null or undefined
            if (bpmnRepositoryId === null || bpmnRepositoryId === undefined) {
                throw new RequiredError('bpmnRepositoryId','Required parameter bpmnRepositoryId was null or undefined when calling createOrUpdateDiagram.');
            }
            const localVarPath = `/api/diagram/{bpmnRepositoryId}`
                .replace(`{${"bpmnRepositoryId"}}`, encodeURIComponent(String(bpmnRepositoryId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Delete one Diagram and all of its versions
         * @param {string} bpmnRepositoryId 
         * @param {string} bpmnDiagramId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteDiagram: async (bpmnRepositoryId: string, bpmnDiagramId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'bpmnRepositoryId' is not null or undefined
            if (bpmnRepositoryId === null || bpmnRepositoryId === undefined) {
                throw new RequiredError('bpmnRepositoryId','Required parameter bpmnRepositoryId was null or undefined when calling deleteDiagram.');
            }
            // verify required parameter 'bpmnDiagramId' is not null or undefined
            if (bpmnDiagramId === null || bpmnDiagramId === undefined) {
                throw new RequiredError('bpmnDiagramId','Required parameter bpmnDiagramId was null or undefined when calling deleteDiagram.');
            }
            const localVarPath = `/api/diagram/{bpmnRepositoryId}/{bpmnDiagramId}`
                .replace(`{${"bpmnRepositoryId"}}`, encodeURIComponent(String(bpmnRepositoryId)))
                .replace(`{${"bpmnDiagramId"}}`, encodeURIComponent(String(bpmnDiagramId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} repositoryId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getDiagramsFromRepo: async (repositoryId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'repositoryId' is not null or undefined
            if (repositoryId === null || repositoryId === undefined) {
                throw new RequiredError('repositoryId','Required parameter repositoryId was null or undefined when calling getDiagramsFromRepo.');
            }
            const localVarPath = `/api/diagram/all/{repositoryId}`
                .replace(`{${"repositoryId"}}`, encodeURIComponent(String(repositoryId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecent: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/diagram/recent10`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} bpmnRepositoryId 
         * @param {string} bpmnDiagramId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSingleDiagram: async (bpmnRepositoryId: string, bpmnDiagramId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'bpmnRepositoryId' is not null or undefined
            if (bpmnRepositoryId === null || bpmnRepositoryId === undefined) {
                throw new RequiredError('bpmnRepositoryId','Required parameter bpmnRepositoryId was null or undefined when calling getSingleDiagram.');
            }
            // verify required parameter 'bpmnDiagramId' is not null or undefined
            if (bpmnDiagramId === null || bpmnDiagramId === undefined) {
                throw new RequiredError('bpmnDiagramId','Required parameter bpmnDiagramId was null or undefined when calling getSingleDiagram.');
            }
            const localVarPath = `/api/diagram/{bpmnRepositoryId}/{bpmnDiagramId}`
                .replace(`{${"bpmnRepositoryId"}}`, encodeURIComponent(String(bpmnRepositoryId)))
                .replace(`{${"bpmnDiagramId"}}`, encodeURIComponent(String(bpmnDiagramId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getStarred: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/diagram/starred`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} bpmnDiagramId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setStarred: async (bpmnDiagramId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'bpmnDiagramId' is not null or undefined
            if (bpmnDiagramId === null || bpmnDiagramId === undefined) {
                throw new RequiredError('bpmnDiagramId','Required parameter bpmnDiagramId was null or undefined when calling setStarred.');
            }
            const localVarPath = `/api/diagram/starred/{bpmnDiagramId}`
                .replace(`{${"bpmnDiagramId"}}`, encodeURIComponent(String(bpmnDiagramId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {BpmnDiagramSVGUploadTO} body 
         * @param {string} bpmnRepositoryId 
         * @param {string} bpmnDiagramId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updatePreviewSVG: async (body: BpmnDiagramSVGUploadTO, bpmnRepositoryId: string, bpmnDiagramId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling updatePreviewSVG.');
            }
            // verify required parameter 'bpmnRepositoryId' is not null or undefined
            if (bpmnRepositoryId === null || bpmnRepositoryId === undefined) {
                throw new RequiredError('bpmnRepositoryId','Required parameter bpmnRepositoryId was null or undefined when calling updatePreviewSVG.');
            }
            // verify required parameter 'bpmnDiagramId' is not null or undefined
            if (bpmnDiagramId === null || bpmnDiagramId === undefined) {
                throw new RequiredError('bpmnDiagramId','Required parameter bpmnDiagramId was null or undefined when calling updatePreviewSVG.');
            }
            const localVarPath = `/api/diagram/{bpmnRepositoryId}/{bpmnDiagramId}`
                .replace(`{${"bpmnRepositoryId"}}`, encodeURIComponent(String(bpmnRepositoryId)))
                .replace(`{${"bpmnDiagramId"}}`, encodeURIComponent(String(bpmnDiagramId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * BpmnDiagramControllerApi - functional programming interface
 * @export
 */
export const BpmnDiagramControllerApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @param {BpmnDiagramUploadTO} body 
         * @param {string} bpmnRepositoryId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createOrUpdateDiagram(body: BpmnDiagramUploadTO, bpmnRepositoryId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BpmnDiagramTO>> {
            const localVarAxiosArgs = await BpmnDiagramControllerApiAxiosParamCreator(configuration).createOrUpdateDiagram(body, bpmnRepositoryId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Delete one Diagram and all of its versions
         * @param {string} bpmnRepositoryId 
         * @param {string} bpmnDiagramId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteDiagram(bpmnRepositoryId: string, bpmnDiagramId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await BpmnDiagramControllerApiAxiosParamCreator(configuration).deleteDiagram(bpmnRepositoryId, bpmnDiagramId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} repositoryId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getDiagramsFromRepo(repositoryId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BpmnDiagramTO>>> {
            const localVarAxiosArgs = await BpmnDiagramControllerApiAxiosParamCreator(configuration).getDiagramsFromRepo(repositoryId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getRecent(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BpmnDiagramTO>>> {
            const localVarAxiosArgs = await BpmnDiagramControllerApiAxiosParamCreator(configuration).getRecent(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} bpmnRepositoryId 
         * @param {string} bpmnDiagramId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getSingleDiagram(bpmnRepositoryId: string, bpmnDiagramId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BpmnDiagramTO>> {
            const localVarAxiosArgs = await BpmnDiagramControllerApiAxiosParamCreator(configuration).getSingleDiagram(bpmnRepositoryId, bpmnDiagramId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getStarred(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BpmnDiagramTO>>> {
            const localVarAxiosArgs = await BpmnDiagramControllerApiAxiosParamCreator(configuration).getStarred(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} bpmnDiagramId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async setStarred(bpmnDiagramId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await BpmnDiagramControllerApiAxiosParamCreator(configuration).setStarred(bpmnDiagramId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {BpmnDiagramSVGUploadTO} body 
         * @param {string} bpmnRepositoryId 
         * @param {string} bpmnDiagramId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updatePreviewSVG(body: BpmnDiagramSVGUploadTO, bpmnRepositoryId: string, bpmnDiagramId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await BpmnDiagramControllerApiAxiosParamCreator(configuration).updatePreviewSVG(body, bpmnRepositoryId, bpmnDiagramId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * BpmnDiagramControllerApi - factory interface
 * @export
 */
export const BpmnDiagramControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @param {BpmnDiagramUploadTO} body 
         * @param {string} bpmnRepositoryId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createOrUpdateDiagram(body: BpmnDiagramUploadTO, bpmnRepositoryId: string, options?: any): AxiosPromise<BpmnDiagramTO> {
            return BpmnDiagramControllerApiFp(configuration).createOrUpdateDiagram(body, bpmnRepositoryId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Delete one Diagram and all of its versions
         * @param {string} bpmnRepositoryId 
         * @param {string} bpmnDiagramId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteDiagram(bpmnRepositoryId: string, bpmnDiagramId: string, options?: any): AxiosPromise<void> {
            return BpmnDiagramControllerApiFp(configuration).deleteDiagram(bpmnRepositoryId, bpmnDiagramId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} repositoryId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getDiagramsFromRepo(repositoryId: string, options?: any): AxiosPromise<Array<BpmnDiagramTO>> {
            return BpmnDiagramControllerApiFp(configuration).getDiagramsFromRepo(repositoryId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecent(options?: any): AxiosPromise<Array<BpmnDiagramTO>> {
            return BpmnDiagramControllerApiFp(configuration).getRecent(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} bpmnRepositoryId 
         * @param {string} bpmnDiagramId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSingleDiagram(bpmnRepositoryId: string, bpmnDiagramId: string, options?: any): AxiosPromise<BpmnDiagramTO> {
            return BpmnDiagramControllerApiFp(configuration).getSingleDiagram(bpmnRepositoryId, bpmnDiagramId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getStarred(options?: any): AxiosPromise<Array<BpmnDiagramTO>> {
            return BpmnDiagramControllerApiFp(configuration).getStarred(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} bpmnDiagramId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setStarred(bpmnDiagramId: string, options?: any): AxiosPromise<void> {
            return BpmnDiagramControllerApiFp(configuration).setStarred(bpmnDiagramId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {BpmnDiagramSVGUploadTO} body 
         * @param {string} bpmnRepositoryId 
         * @param {string} bpmnDiagramId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updatePreviewSVG(body: BpmnDiagramSVGUploadTO, bpmnRepositoryId: string, bpmnDiagramId: string, options?: any): AxiosPromise<void> {
            return BpmnDiagramControllerApiFp(configuration).updatePreviewSVG(body, bpmnRepositoryId, bpmnDiagramId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * BpmnDiagramControllerApi - object-oriented interface
 * @export
 * @class BpmnDiagramControllerApi
 * @extends {BaseAPI}
 */
export class BpmnDiagramControllerApi extends BaseAPI {
    /**
     * 
     * @param {BpmnDiagramUploadTO} body 
     * @param {string} bpmnRepositoryId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BpmnDiagramControllerApi
     */
    public createOrUpdateDiagram(body: BpmnDiagramUploadTO, bpmnRepositoryId: string, options?: any) {
        return BpmnDiagramControllerApiFp(this.configuration).createOrUpdateDiagram(body, bpmnRepositoryId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Delete one Diagram and all of its versions
     * @param {string} bpmnRepositoryId 
     * @param {string} bpmnDiagramId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BpmnDiagramControllerApi
     */
    public deleteDiagram(bpmnRepositoryId: string, bpmnDiagramId: string, options?: any) {
        return BpmnDiagramControllerApiFp(this.configuration).deleteDiagram(bpmnRepositoryId, bpmnDiagramId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {string} repositoryId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BpmnDiagramControllerApi
     */
    public getDiagramsFromRepo(repositoryId: string, options?: any) {
        return BpmnDiagramControllerApiFp(this.configuration).getDiagramsFromRepo(repositoryId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BpmnDiagramControllerApi
     */
    public getRecent(options?: any) {
        return BpmnDiagramControllerApiFp(this.configuration).getRecent(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {string} bpmnRepositoryId 
     * @param {string} bpmnDiagramId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BpmnDiagramControllerApi
     */
    public getSingleDiagram(bpmnRepositoryId: string, bpmnDiagramId: string, options?: any) {
        return BpmnDiagramControllerApiFp(this.configuration).getSingleDiagram(bpmnRepositoryId, bpmnDiagramId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BpmnDiagramControllerApi
     */
    public getStarred(options?: any) {
        return BpmnDiagramControllerApiFp(this.configuration).getStarred(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {string} bpmnDiagramId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BpmnDiagramControllerApi
     */
    public setStarred(bpmnDiagramId: string, options?: any) {
        return BpmnDiagramControllerApiFp(this.configuration).setStarred(bpmnDiagramId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {BpmnDiagramSVGUploadTO} body 
     * @param {string} bpmnRepositoryId 
     * @param {string} bpmnDiagramId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BpmnDiagramControllerApi
     */
    public updatePreviewSVG(body: BpmnDiagramSVGUploadTO, bpmnRepositoryId: string, bpmnDiagramId: string, options?: any) {
        return BpmnDiagramControllerApiFp(this.configuration).updatePreviewSVG(body, bpmnRepositoryId, bpmnDiagramId, options).then((request) => request(this.axios, this.basePath));
    }
}

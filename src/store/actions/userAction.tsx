import { AxiosResponse } from "axios";
import * as api from "../../api/api";
import { UserInfoTO } from "../../api";
import { getClientConfig } from "../../api/config";

export const searchUsers = async (typedName: string): Promise<AxiosResponse<UserInfoTO[]>> => {
    const userController = new api.UserApi();
    const config = getClientConfig();
    return userController.searchUsers(typedName, config);
};

export const getMultipleUsers = async (userIds: Array<string>): Promise<AxiosResponse<UserInfoTO[]>> => {
    const userController = new api.UserApi();
    const config = getClientConfig();
    return userController.getMultipleUsers(userIds, config);
};

import { apiMethods } from "./httpClient.js";

export const getUser = async () => {
    try {
        const url = `/users/profile`;
        const response = await apiMethods.get(url);
        return response;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

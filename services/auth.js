import { publicApiMethods } from "./httpClient";
import { saveRefreshToken, saveToken } from "./tokenStorage";

export const register = async (userData) => {
    try {
        const response = await publicApiMethods.post("/auth/register", userData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const login = async (email, password) => {
    try {
        const response = await publicApiMethods.post("/auth/login", { email, password });
        if (response.accessToken && response.refreshToken) {
            await saveToken(response.accessToken);
            await saveRefreshToken(response.refreshToken);
        } else {
            throw new Error("Invalid response: missing tokens");
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message || "Login failed" };
    }
};

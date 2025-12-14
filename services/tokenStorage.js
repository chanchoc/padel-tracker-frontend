import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "@PadelTracker:accessToken";
const REFRESH_TOKEN_KEY = "@PadelTracker:refreshToken";

export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (error) {
        console.log("Error saving token:", error);
        throw error;
    }
};

export const saveRefreshToken = async (token) => {
    try {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
        console.log("Error saving refresh token:", error);
        throw error;
    }
};

export const getToken = async () => {
    try {
        return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
    }
};

export const getRefreshToken = async () => {
    try {
        return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error("Error retrieving refresh token:", error);
        return null;
    }
};

export const clearTokens = async () => {
    try {
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error("Error clearing tokens:", error);
        throw error;
    }
};

import { URLSearchParams } from "react-native-url-polyfill";
import { clearTokens, getRefreshToken, getToken, saveToken } from "./tokenStorage";
import Toast from "react-native-toast-message";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const MAX_RETRY_ATTEMPTS = 1;

export const refreshTokens = async () => {
    try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }
        const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        await saveToken(data.accessToken);
        return data.accessToken;
    } catch (error) {
        await clearTokens();
        console.error("Error refreshing tokens:", error);
        Toast.show({
            type: "error",
            text1: "Session expired",
            text2: "Please log in again.",
            position: "top",
            visibilityTime: 1500,
        });
        throw new Error("Session expired, please log in again.");
    }
};

export const authenticatedFetch = async (url, options = {}, retryCount = 0) => {
    try {
        const token = await getToken();
        if (!token) {
            throw new Error("No access token available");
        }
        const response = await fetch(`${BASE_URL}/api${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        });
        if (response.status === 401 && retryCount < MAX_RETRY_ATTEMPTS) {
            await refreshTokens();
            return authenticatedFetch(url, options, retryCount + 1);
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error in authenticatedFetch:", error);
        throw error;
    }
};

export const publicFetch = async (url, options = {}) => {
    try {
        const response = await fetch(`${BASE_URL}/api${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error in publicFetch:", error);
        throw error;
    }
};

export const testAuthentication = async () => {
    try {
        const token = await getToken();
        if (!token) {
            return { success: false, error: "No access token available" };
        }
        await authenticatedFetch(`/users/profile`);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.message.includes("Session expired") ? "Session expired" : "Authentication failed",
        };
    }
};

export const buildQueryString = (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
                value.forEach((item) => {
                    if (item !== undefined && item !== null && item !== "") {
                        searchParams.append(key, item);
                    }
                });
            } else {
                searchParams.append(key, value);
            }
        }
    });
    return searchParams.toString();
};

export const apiMethods = {
    get: (url, params = {}) => {
        const queryString = buildQueryString(params);
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        return authenticatedFetch(fullUrl, { method: "GET" });
    },
    post: (url, body) => {
        return authenticatedFetch(url, {
            method: "POST",
            body: JSON.stringify(body),
        });
    },
    put: (url, data) => {
        return authenticatedFetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },
    delete: (url, body) => {
        const options = { method: "DELETE" };
        if (body) {
            options.body = JSON.stringify(body);
        }
        return authenticatedFetch(url, options);
    },
};

export const publicApiMethods = {
    post: (url, data) => {
        return publicFetch(url, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },
};

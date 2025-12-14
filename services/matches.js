import { apiMethods } from "./httpClient.js";

export const getMatches = async (filters = {}) => {
    try {
        const url = "/matches";
        const response = await apiMethods.get(url, filters);
        return response;
    } catch (error) {
        console.error("Error fetching matches:", error);
        throw error;
    }
};

export const createMatch = async (data) => {
    try {
        const url = `/matches`;
        const response = await apiMethods.post(url, data);
        return response;
    } catch (error) {
        console.error("Error creating match:", error);
        throw error;
    }
};

export const getMatch = async (mid) => {
    try {
        const url = `/matches/${mid}`;
        const response = await apiMethods.get(url);
        return response;
    } catch (error) {
        console.error("Error fetching match:", error);
        throw error;
    }
};

export const deleteMatch = async (mid) => {
    try {
        const url = `/matches/${mid}`;
        const response = await apiMethods.delete(url);
        return response;
    } catch (error) {
        console.error("Error deleting match:", error);
        throw error;
    }
};

export const updateMatch = async (mid, data) => {
    try {
        const url = `/matches/${mid}`;
        const response = await apiMethods.put(url, data);
        return response;
    } catch (error) {
        console.error("Error updating match:", error);
        throw error;
    }
};

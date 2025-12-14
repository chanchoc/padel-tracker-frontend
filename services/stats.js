import { apiMethods } from "./httpClient.js";

export const getSummaryStats = async (filters = {}) => {
    try {
        const url = "/stats/summary";
        const response = await apiMethods.get(url, filters);
        return response;
    } catch (error) {
        console.error("Error fetching summary stats:", error);
        throw error;
    }
};

export const getHeadToHeadStats = async (filters = {}) => {
    try {
        const url = "/stats/head-to-head";
        const response = await apiMethods.get(url, filters);
        return response;
    } catch (error) {
        console.error("Error fetching head-to-head stats:", error);
        throw error;
    }
};

export const getTimeline = async (filters = {}) => {
    try {
        const url = "/stats/timeline";
        const response = await apiMethods.get(url, filters);
        return response;
    } catch (error) {
        console.error("Error fetching timeline stats:", error);
        throw error;
    }
};

import { apiMethods } from "./httpClient.js";

export const getPlayers = async () => {
    try {
        const url = `/players`;
        const response = await apiMethods.get(url);
        return response;
    } catch (error) {
        console.error("Error fetching players:", error);
        throw error;
    }
};

export const createPlayer = async (playerData) => {
    try {
        const url = `/players`;
        const response = await apiMethods.post(url, playerData);
        return response;
    } catch (error) {
        console.error("Error creating player:", error);
        throw error;
    }
};

export const deletePlayer = async (playerId) => {
    try {
        const url = `/players/${playerId}`;
        const response = await apiMethods.delete(url);
        return response;
    } catch (error) {
        console.error("Error deleting player:", error);
        throw error;
    }
};

export const updatePlayer = async (playerId, playerData) => {
    try {
        const url = `/players/${playerId}`;
        const response = await apiMethods.put(url, playerData);
        return response;
    } catch (error) {
        console.error("Error updating player:", error);
        throw error;
    }
};

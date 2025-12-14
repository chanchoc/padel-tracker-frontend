import { styled } from "nativewind";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { usePlayers } from "../hooks/usePlayers.js";
import { deletePlayer } from "../services/players.js";
import Toast from "react-native-toast-message";

const StyledPressable = styled(Pressable);

export function DeletePlayer({ playerId, disabled = false, classes = "", name = "Player" }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { refreshPlayers } = usePlayers();

    const handleDeletePress = () => {
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setShowConfirm(false);
        setIsLoading(true);
        try {
            await deletePlayer(playerId);
            refreshPlayers();
            Toast.show({
                type: "success",
                text1: `${name} was deleted`,
                text2: "The player has been removed.",
                position: "top",
                visibilityTime: 1500,
            });
        } catch (error) {
            console.error("Error deleting player:", error);
            Toast.show({
                type: "error",
                text1: "Delete failed",
                text2: "Please try again",
                position: "top",
                visibilityTime: 1500,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    return (
        <>
            <StyledPressable
                className={`px-3 py-3 bg-red-500 rounded-lg min-w-[60] active:opacity-70 ${
                    disabled || isLoading ? "opacity-50" : ""
                } ${classes}`}
                onPress={handleDeletePress}
                disabled={disabled || isLoading}
            >
                <Text className="text-white font-poppins-semibold text-center text-xs">
                    {disabled ? "In use" : "Delete"}
                </Text>
            </StyledPressable>
            <Modal visible={showConfirm} transparent={true} animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <Text className="text-xl font-poppins-bold text-gray-900 mb-2">Confirm delete</Text>
                        <Text className="text-gray-600 mb-6 font-poppins">
                            Are you sure you want to delete this player?
                        </Text>
                        <View className="flex-row gap-3">
                            <StyledPressable
                                className={`flex-1 bg-gray-200 py-3 rounded-lg active:opacity-70 ${
                                    isLoading ? "opacity-50" : ""
                                }`}
                                onPress={cancelDelete}
                                disabled={isLoading}
                            >
                                <Text className="text-gray-800 text-center font-poppins-semibold">Cancel</Text>
                            </StyledPressable>

                            <StyledPressable
                                className={`flex-1 bg-red-500 py-3 rounded-lg active:opacity-70 ${
                                    isLoading ? "opacity-50" : ""
                                }`}
                                onPress={confirmDelete}
                                disabled={isLoading}
                            >
                                <Text className="text-white text-center font-poppins-bold">
                                    {isLoading ? "Deleting..." : "Delete"}
                                </Text>
                            </StyledPressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

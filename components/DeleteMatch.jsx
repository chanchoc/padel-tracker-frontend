import { styled } from "nativewind";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useMatches } from "../hooks/useMatches.js";
import { deleteMatch } from "../services/matches.js";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const StyledPressable = styled(Pressable);

export function DeleteMatch({ matchId }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { refreshMatches } = useMatches();

    const handleDeletePress = () => {
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setShowConfirm(false);
        setIsLoading(true);
        try {
            await deleteMatch(matchId);
            refreshMatches();
            Toast.show({
                type: "success",
                text1: "Match deleted",
                text2: "The match has been removed.",
                position: "top",
                visibilityTime: 1500,
            });
            router.replace("/(tabs)");
        } catch (error) {
            console.error("Error deleting match:", error);
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
                className={`bg-red-600 rounded-full py-4 px-6 ${isLoading ? "bg-red-300" : "active:opacity-70"}`}
                onPress={handleDeletePress}
                disabled={isLoading}
            >
                <Text className="text-surface text-center font-poppins-semibold text-xl min-w-[28]">
                    {isLoading ? "Deleting..." : "Delete"}
                </Text>
            </StyledPressable>
            <Modal visible={showConfirm} transparent={true} animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <Text className="text-xl font-poppins-bold text-gray-900 mb-2">Confirm delete</Text>
                        <Text className="text-gray-600 mb-6 font-poppins">
                            Are you sure you want to delete this match?
                        </Text>
                        <View className="flex-row gap-3">
                            <StyledPressable
                                className="flex-1 bg-gray-200 py-3 rounded-lg active:opacity-70"
                                onPress={cancelDelete}
                                disabled={isLoading}
                            >
                                <Text className="text-gray-800 text-center font-poppins-semibold">Cancel</Text>
                            </StyledPressable>

                            <StyledPressable
                                className="flex-1 bg-red-500 py-3 rounded-lg active:opacity-70"
                                onPress={confirmDelete}
                                disabled={isLoading}
                            >
                                <Text className="text-white text-center font-poppins-semibold">
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

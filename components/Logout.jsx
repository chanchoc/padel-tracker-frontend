import { Modal, Pressable, Text, View } from "react-native";
import { styled } from "nativewind";
import { useAuth } from "../hooks/useAuth.js";
import Toast from "react-native-toast-message";
import { useState } from "react";

const StyledPressable = styled(Pressable);

export function Logout() {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { logout } = useAuth();

    const handleLogoutPress = () => {
        setShowConfirm(true);
    };

    const confirmLogout = async () => {
        setShowConfirm(false);
        setIsLoading(true);
        try {
            await logout(true, 500);
        } catch (error) {
            console.error("Logout error:", error);
            Toast.show({
                type: "error",
                text1: "Logout failed",
                text2: "Please try again",
                position: "top",
                visibilityTime: 1500,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const cancelLogout = () => {
        setShowConfirm(false);
    };

    return (
        <>
            <StyledPressable
                className={`bg-red-600 rounded-full py-4 px-6 ${isLoading ? "bg-red-300" : "active:opacity-70"}`}
                onPress={handleLogoutPress}
                disabled={isLoading}
            >
                <Text className="text-surface text-center font-poppins-bold text-xl min-w-[28]">
                    {isLoading ? "Logging out..." : "Logout"}
                </Text>
            </StyledPressable>
            <Modal visible={showConfirm} transparent={true} animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <Text className="text-xl font-poppins-bold text-gray-900 mb-2">Confirm logout</Text>
                        <Text className="text-gray-600 mb-6 font-poppins">Are you sure you want to log out?</Text>
                        <View className="flex-row gap-3">
                            <StyledPressable
                                className="flex-1 bg-gray-200 py-3 rounded-lg active:opacity-70"
                                onPress={cancelLogout}
                                disabled={isLoading}
                            >
                                <Text className="text-gray-800 text-center font-poppins-semibold">Cancel</Text>
                            </StyledPressable>
                            <StyledPressable
                                className={`flex-1 bg-red-500 py-3 rounded-lg active:opacity-70 ${
                                    isLoading ? "opacity-50" : ""
                                }`}
                                onPress={confirmLogout}
                                disabled={isLoading}
                            >
                                <Text className="text-white text-center font-poppins-semibold">
                                    {isLoading ? "Logging out..." : "Logout"}
                                </Text>
                            </StyledPressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

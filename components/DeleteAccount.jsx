import { styled } from "nativewind";
import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { deleteAccount } from "../services/users.js";
import { useAuth } from "../hooks/useAuth.js";
import Toast from "react-native-toast-message";

const StyledPressable = styled(Pressable);
const StyledTextInput = styled(TextInput);

export function DeleteAccount() {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [password, setPassword] = useState("");
    const { logout } = useAuth();

    const handleDeleteAccount = () => {
        setShowConfirm(true);
    };

    const cancelDeleteAccount = () => {
        setPassword("");
        setIsFocused(false);
        setShowConfirm(false);
    };

    const confirmDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await deleteAccount(password);
            await logout(true);
            Toast.show({
                type: "success",
                text1: "Account deleted",
                text2: "Your account has been successfully deleted",
                position: "top",
                visibilityTime: 1500,
            });
        } catch (error) {
            console.error("Delete account error:", error);
            Toast.show({
                type: "error",
                text1: "Delete account failed",
                text2: "Please try again",
                position: "top",
                visibilityTime: 1500,
            });
        } finally {
            setIsLoading(false);
            setPassword("");
            setShowConfirm(false);
        }
    };

    return (
        <>
            <StyledPressable
                className="text-center bg-blue-200 rounded-full py-2 px-4 active:opacity-70 mt-0"
                onPress={handleDeleteAccount}
            >
                <Text className="font-poppins-bold text-xs">Delete account</Text>
            </StyledPressable>
            <Modal visible={showConfirm} transparent={true} animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <Text className="text-xl font-poppins-bold text-gray-900 mb-2">Confirm delete account</Text>
                        <Text className="text-gray-600 font-poppins">
                            Are you sure you want delete your account?{"\n"}All your information (matches, players, etc)
                            will be lost.
                        </Text>
                        <Text className="text-gray-600 font-poppins-bold mb-2">
                            There is no way to recover it.{"\n"}To confirm please enter you password:
                        </Text>
                        <View
                            className={`bg-slate-100 flex-row items-center justify-start space-x-4 rounded-xl py-3 px-4 border ${
                                isFocused ? "border-primary" : "border-border"
                            } mb-6`}
                        >
                            <StyledTextInput
                                className="flex-1 text-textPrimary text-base font-poppins p-0"
                                placeholder="Enter your password"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                editable={!isLoading}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                        <View className="flex-row gap-3">
                            <StyledPressable
                                className={`flex-1 bg-gray-200 py-3 rounded-lg active:opacity-70 ${
                                    isLoading ? "opacity-50" : ""
                                }`}
                                onPress={cancelDeleteAccount}
                                disabled={isLoading}
                            >
                                <Text className="text-gray-800 text-center font-poppins-semibold">Cancel</Text>
                            </StyledPressable>
                            <StyledPressable
                                className={`flex-1 bg-red-500 py-3 rounded-lg active:opacity-70 ${
                                    isLoading || !password.trim() ? "opacity-50" : ""
                                }`}
                                onPress={confirmDeleteAccount}
                                disabled={isLoading || !password.trim()}
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

import { styled } from "nativewind";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { FormInput } from "./FormInput.jsx";
import { UserIcon } from "./Icons.jsx";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { createPlayer } from "../services/players.js";
import { usePlayers } from "../hooks/usePlayers.js";

const StyledPressable = styled(Pressable);

const playerSchema = yup.object({
    name: yup.string().required("Name is required").max(100, "Name must be at most 100 characters"),
});

export function NewPlayer({ players, onCreated, refresh = false, fastCreate = false }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { refreshPlayers } = usePlayers();
    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(playerSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
        },
    });

    const handleNewPlayerPress = () => {
        setShowConfirm(true);
    };

    const confirmNewPlayer = async (data) => {
        const formattedPlayer = formatPlayer(data);
        const isDuplicate = players.some(
            (player) => player.name.toLowerCase().trim() === formattedPlayer.name.toLowerCase()
        );
        if (isDuplicate) {
            cancelNewPlayer();
            Toast.show({
                type: "error",
                text1: "Duplicate player",
                text2: "A player with this name already exists",
                position: "top",
                visibilityTime: 1500,
            });
            return;
        }
        setIsLoading(true);
        try {
            const response = await createPlayer(formattedPlayer);
            const newPlayer = response?.data;
            if (!newPlayer._id) {
                throw new Error("Player creation failed");
            }
            if (refresh) refreshPlayers();
            onCreated?.(newPlayer);
            reset({ name: "" });
            Toast.show({
                type: "success",
                text1: "Player created",
                text2: `${newPlayer.name} has been added successfully`,
                position: "top",
                visibilityTime: 1500,
            });
            setShowConfirm(false);
        } catch (error) {
            console.error("New player creation error:", error);
            Toast.show({
                type: "error",
                text1: "Creation failed",
                text2: "Please try again",
                position: "top",
                visibilityTime: 1500,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const cancelNewPlayer = () => {
        reset({ name: "" });
        setShowConfirm(false);
    };

    const formatPlayer = (data) => {
        return { name: data.name.trim() };
    };

    return (
        <>
            {fastCreate ? (
                <StyledPressable
                    className="rounded-lg bg-primary/10 px-3 py-1 active:bg-gray-300 border border-primary"
                    onPress={handleNewPlayerPress}
                    disabled={isLoading}
                >
                    <Text className="text-primary text-sm font-poppins-semibold">+ New player</Text>
                </StyledPressable>
            ) : (
                <StyledPressable
                    className="bg-surface mx-4 rounded-full h-10 w-10 items-center justify-center active:bg-gray-300"
                    onPress={handleNewPlayerPress}
                    disabled={isLoading}
                >
                    <Text className="text-blue-800 text-2xl font-poppins-bold">+</Text>
                </StyledPressable>
            )}
            <Modal visible={showConfirm} transparent={true} animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <Text className="text-xl font-poppins-bold text-gray-900 mb-2">Create new player:</Text>
                        <FormInput
                            control={control}
                            name="name"
                            label="Player Name"
                            placeholder="Player Name"
                            keyboardType="default"
                            required={true}
                            maxLength={100}
                            icon={<UserIcon size={24} />}
                            updating={isLoading}
                        />
                        <View className="flex-row gap-3">
                            <StyledPressable
                                className={`flex-1 bg-gray-200 py-3 rounded-lg active:opacity-70 ${
                                    isLoading ? "opacity-50" : ""
                                }`}
                                onPress={cancelNewPlayer}
                                disabled={isLoading}
                            >
                                <Text className="text-gray-800 text-center font-poppins-semibold">Cancel</Text>
                            </StyledPressable>

                            <StyledPressable
                                className={`flex-1 bg-primary py-3 rounded-lg active:opacity-70 ${
                                    isLoading ? "opacity-50" : ""
                                }`}
                                onPress={handleSubmit(confirmNewPlayer)}
                                disabled={isLoading}
                            >
                                <Text className="text-white text-center font-poppins-semibold">
                                    {isLoading ? "Creating..." : "Create"}
                                </Text>
                            </StyledPressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

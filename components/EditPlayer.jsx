import { yupResolver } from "@hookform/resolvers/yup";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Pressable, Text, View } from "react-native";
import * as yup from "yup";
import { getPlayers, updatePlayer } from "../services/players.js";
import { FormInput } from "./FormInput.jsx";
import { UserIcon } from "./Icons.jsx";
import Toast from "react-native-toast-message";
import { usePlayers } from "../hooks/usePlayers.js";
import { useMatches } from "../hooks/useMatches.js";

const StyledPressable = styled(Pressable);

const playerSchema = yup.object({
    name: yup.string().required("Name is required").max(100, "Name must be at most 100 characters"),
});

export function EditPlayer({ playerId, name, classes = "" }) {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { refreshPlayers } = usePlayers();
    const { refreshMatches } = useMatches();
    const { control, handleSubmit, reset, watch } = useForm({
        resolver: yupResolver(playerSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
        },
    });
    const formValues = watch();
    const hasChanged = name && JSON.stringify(formValues) !== JSON.stringify({ name: name });

    useEffect(() => {
        if (showConfirm) {
            setLoading(true);
            getPlayers()
                .then((data) => {
                    setPlayers(data.data);
                })
                .catch((error) => {
                    console.error("Error fetching players:", error);
                    setShowConfirm(false);
                    Toast.show({
                        type: "error",
                        text1: "Error loading players",
                        text2: "Please try again later",
                        position: "top",
                        visibilityTime: 1500,
                    });
                })
                .finally(() => {
                    setLoading(false);
                    reset({ name: name });
                });
        }
    }, [playerId, showConfirm, reset, name]);

    const handleEditPlayerPress = () => {
        setShowConfirm(true);
    };

    const confirmEditPlayer = async (data) => {
        const formattedPlayer = formatPlayer(data);
        const isDuplicate = players.some((player) => {
            if (!player.name) return false;
            return player.name.toLowerCase().trim() === formattedPlayer.name.toLowerCase();
        });
        if (isDuplicate) {
            setShowConfirm(false);
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
            const response = await updatePlayer(playerId, formattedPlayer);
            const updatedPlayer = response?.data;
            if (!updatedPlayer._id) {
                throw new Error("Player update failed");
            }
            refreshPlayers();
            refreshMatches();
            Toast.show({
                type: "success",
                text1: "Player updated",
                text2: `${updatedPlayer.name} has been updated successfully`,
                position: "top",
                visibilityTime: 1500,
            });
            setShowConfirm(false);
        } catch (error) {
            console.error("Edit player error:", error);
            Toast.show({
                type: "error",
                text1: "Edit failed",
                text2: "Please try again",
                position: "top",
                visibilityTime: 1500,
            });
            setShowConfirm(false);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelEditPlayer = () => {
        setShowConfirm(false);
    };

    const formatPlayer = (data) => {
        return { name: data.name.trim() };
    };

    return (
        <>
            <StyledPressable
                className={`px-3 py-3 bg-primary rounded-lg min-w-[60] active:opacity-70 ${classes}`}
                onPress={handleEditPlayerPress}
                disabled={isLoading || loading}
            >
                <Text className="text-white font-poppins-semibold text-center text-xs">Edit</Text>
            </StyledPressable>
            <Modal visible={showConfirm} transparent={true} animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <Text className="text-xl font-poppins-bold text-gray-900 mb-2">Edit player:</Text>
                        <FormInput
                            control={control}
                            name="name"
                            label="Player Name"
                            placeholder="Player Name"
                            keyboardType="default"
                            required={true}
                            maxLength={100}
                            icon={<UserIcon size={24} />}
                            updating={isLoading || loading}
                        />
                        <View className="flex-row gap-3">
                            <StyledPressable
                                className={`flex-1 bg-gray-200 py-3 rounded-lg active:opacity-70 ${
                                    isLoading || loading ? "opacity-50" : ""
                                }`}
                                onPress={cancelEditPlayer}
                                disabled={isLoading || loading}
                            >
                                <Text className="text-gray-800 text-center font-poppins-semibold">Cancel</Text>
                            </StyledPressable>

                            <StyledPressable
                                className={`flex-1 bg-primary py-3 rounded-lg active:opacity-70 ${
                                    isLoading || loading ? "opacity-50" : ""
                                } ${hasChanged ? "" : "opacity-50"}`}
                                onPress={handleSubmit(confirmEditPlayer)}
                                disabled={isLoading || loading || !hasChanged}
                            >
                                <Text className="text-white text-center font-poppins-semibold">
                                    {isLoading ? "Editing..." : "Edit"}
                                </Text>
                            </StyledPressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

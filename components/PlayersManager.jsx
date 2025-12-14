import { styled } from "nativewind";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackArrowIcon } from "./Icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getPlayers } from "../services/players.js";
import { ErrorMessage } from "./ErrorMessage.jsx";
import { PlayerCard, PlayerCardSkeleton } from "./PlayerCard.jsx";
import { usePlayers } from "../hooks/usePlayers.js";
import { NewPlayer } from "./NewPlayer.jsx";

const StyledPressable = styled(Pressable);

export function PlayersManager() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { refreshTrigger } = usePlayers();

    useEffect(() => {
        getPlayers()
            .then((data) => {
                setPlayers(orderPlayersByMatchesAndName(data.data));
            })
            .catch((error) => {
                console.error("Error fetching players:", error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [refreshTrigger]);

    const orderPlayersByMatchesAndName = (playersList) => {
        return playersList.sort((a, b) => {
            const matchDiff = (b.matchCount || 0) - (a.matchCount || 0);
            if (matchDiff !== 0) return matchDiff;
            return a.name.localeCompare(b.name);
        });
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 py-4 px-6 bg-background">
                {/* Sticky Header */}
                <View
                    className="flex-row items-center justify-between rounded-lg p-4 mb-4 bg-slate-900"
                    style={{ backgroundColor: "#0F172A" }}
                >
                    <StyledPressable
                        className="bg-surface mx-4 rounded-full h-10 w-10 items-center justify-center active:bg-gray-300"
                        accessibilityLabel="Go back to matches list"
                        accessibilityHint="Returns to the matches list without saving"
                        onPress={() => router.back()}
                    >
                        <BackArrowIcon color="#1E40AF" />
                    </StyledPressable>
                    <Text className="text-surface font-poppins-bold text-lg">Players Manager</Text>
                    <StyledPressable
                        className="bg-surface mx-4 rounded-full h-10 w-10 items-center justify-center active:bg-gray-300 opacity-50"
                        accessibilityLabel="Save new match"
                        accessibilityHint="Saves the new match and returns to the expenses list"
                        disabled={true}
                    >
                        <Text className="text-blue-800 text-2xl font-poppins-bold">+</Text>
                    </StyledPressable>
                </View>
                {/* Loading skeleton */}
                <View className="bg-surface p-4 rounded-lg shadow-sm">
                    {[0, 1, 2].map((index) => (
                        <PlayerCardSkeleton key={index} index={index} />
                    ))}
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 py-4 px-6 bg-background">
                {/* Sticky Header */}
                <View
                    className="flex-row items-center justify-between rounded-lg p-4 mb-4 bg-slate-900"
                    style={{ backgroundColor: "#0F172A" }}
                >
                    <StyledPressable
                        className="bg-surface mx-4 rounded-full h-10 w-10 items-center justify-center active:bg-gray-300"
                        accessibilityLabel="Go back to matches list"
                        accessibilityHint="Returns to the matches list without saving"
                        onPress={() => router.back()}
                    >
                        <BackArrowIcon color="#1E40AF" />
                    </StyledPressable>
                    <Text className="text-surface font-poppins-bold text-lg">Players Manager</Text>
                    <StyledPressable
                        className="bg-surface mx-4 rounded-full h-10 w-10 items-center justify-center active:bg-gray-300 opacity-50"
                        accessibilityLabel="Save new match"
                        accessibilityHint="Saves the new match and returns to the expenses list"
                        disabled={true}
                    >
                        <Text className="text-blue-800 text-2xl font-poppins-bold">+</Text>
                    </StyledPressable>
                </View>
                {/* Error Message */}
                <ScrollView>
                    <ErrorMessage
                        message="There was an error loading the players. Please try again later."
                        classes={"py-0"}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 py-4 px-6 bg-background">
            {/* Sticky Header */}
            <View
                className="flex-row items-center justify-between rounded-lg p-4 mb-4 bg-slate-900"
                style={{ backgroundColor: "#0F172A" }}
            >
                <StyledPressable
                    className="bg-surface mx-4 rounded-full h-10 w-10 items-center justify-center active:bg-gray-300"
                    accessibilityLabel="Go back to matches list"
                    accessibilityHint="Returns to the matches list without saving"
                    onPress={() => router.back()}
                >
                    <BackArrowIcon color="#1E40AF" />
                </StyledPressable>
                <Text className="text-surface font-poppins-bold text-lg">Players Manager</Text>
                <NewPlayer players={players} refresh={true} />
            </View>
            {/* Flatlist */}
            <View className="flex-1 justify-center items-center bg-surface p-4 rounded-lg shadow-sm">
                {players.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <View className="items-center">
                            <Text className="text-2xl font-poppins-bold text-textPrimary mb-2 text-center">
                                No players yet
                            </Text>
                            <Text className="text-textSecondary font-poppins text-center mb-2 leading-6">
                                Start adding players to keep track of who you play with and view their stats over time.
                            </Text>
                            <View className="bg-primary/10 rounded-lg px-4 py-3 border border-primary">
                                <Text className="text-primary font-poppins-semibold text-center">
                                    Tap the + button to create your first player
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <FlatList
                        data={players}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={({ item, index }) => <PlayerCard player={item} />}
                        className="flex-1 w-full"
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

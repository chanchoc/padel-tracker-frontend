import { Pressable, ScrollView, Text, View } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackArrowIcon, EditIcon, LevelIcon, LocationIcon, OpponentIcon, SideIcon, TeammateIcon } from "./Icons.jsx";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getMatch } from "../services/matches.js";
import { MatchDetailsSkeleton } from "./MatchDetailsSkeleton.jsx";
import { ErrorMessage } from "./ErrorMessage.jsx";
import { DeleteMatch } from "./DeleteMatch.jsx";
import { useMatches } from "../hooks/useMatches.js";

const StyledPressable = styled(Pressable);

export function MatchDetails({ matchId }) {
    const [match, setMatch] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { refreshTrigger } = useMatches();
    const resultColors = {
        Win: "bg-emerald-100 border-emerald-500",
        Lose: "bg-red-100 border-red-500",
        Draw: "bg-blue-100 border-blue-500",
        DNF: "bg-slate-100 border-slate-400",
    };
    const resultTextColors = {
        Win: "text-emerald-700",
        Lose: "text-red-700",
        Draw: "text-blue-700",
        DNF: "text-slate-700",
    };

    useEffect(() => {
        setLoading(true);
        setError(null);
        getMatch(matchId)
            .then((data) => {
                setMatch(data.data);
            })
            .catch((error) => {
                console.error("Error fetching match:", error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [matchId, refreshTrigger]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 py-4 px-6 bg-background">
                {/* Sticky Header */}
                <View
                    className="flex-row items-center justify-between rounded-lg p-4 mb-4 bg-slate-900 sticky"
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
                    <Text className="text-surface font-poppins-bold text-lg">Match Details</Text>
                    <StyledPressable
                        className="bg-surface opacity-40 mx-4 rounded-full h-10 w-10 items-center justify-center"
                        accessibilityLabel="Edit this match"
                        accessibilityHint="Opens the edit form for this match"
                        onPress={() => console.log("Edit match")}
                        disabled={true}
                    >
                        <EditIcon color="#1E40AF" />
                    </StyledPressable>
                </View>
                <ScrollView>
                    {/* Loading skeleton */}
                    <MatchDetailsSkeleton />
                </ScrollView>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 py-4 px-6 bg-background">
                {/* Header */}
                <View
                    className="flex-row items-center justify-between rounded-lg p-4 mb-4 bg-slate-900 sticky"
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
                    <Text className="text-surface font-poppins-bold text-lg">Match Details</Text>
                    <StyledPressable
                        className="bg-surface opacity-40 mx-4 rounded-full h-10 w-10 items-center justify-center"
                        accessibilityLabel="Edit this match"
                        accessibilityHint="Opens the edit form for this match"
                        onPress={() => console.log("Edit match")}
                        disabled={true}
                    >
                        <EditIcon color="#1E40AF" />
                    </StyledPressable>
                </View>
                {/* Error message */}
                <ScrollView>
                    <ErrorMessage message={"Error loading match details"} classes={"py-0"} />
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 py-4 px-6 bg-background">
            {/* Sticky Header */}
            <View
                className="flex-row items-center justify-between rounded-lg p-4 mb-4 bg-slate-900 sticky"
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
                <Text className="text-surface font-poppins-bold text-lg">Match Details</Text>
                <StyledPressable
                    className="bg-surface mx-4 rounded-full h-10 w-10 items-center justify-center"
                    accessibilityLabel="Edit this match"
                    accessibilityHint="Opens the edit form for this match"
                    onPress={() => router.push(`/edit-match/${matchId}`)}
                >
                    <EditIcon color="#1E40AF" />
                </StyledPressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Results */}
                <View
                    className={`flex-1 items-center justify-center space-y-3 bg-slate-200 rounded-lg shadow-sm mb-4 py-6 ${
                        resultColors[match?.result || "Win"]
                    }`}
                >
                    <Text className={`text-3xl font-poppins-bold ${resultTextColors[match?.result || "Win"]}`}>
                        {match?.score || match?.result}
                    </Text>
                    <Text
                        className={`font-poppins-semibold text-lg tracking-wide ${
                            resultTextColors[match?.result || "Win"]
                        }`}
                    >
                        {new Date(match.date).toLocaleDateString("en-US", {
                            day: "numeric",
                            weekday: "short",
                            month: "long",
                            year: "numeric",
                        })}
                    </Text>
                </View>
                {/* Players */}
                <View className="flex-1 bg-surface rounded-lg p-4 shadow-sm mb-4 space-y-3">
                    <Text className="text-textSecondary text-sm font-poppins">Players</Text>
                    <View className="flex-row space-x-4 items-center">
                        <TeammateIcon color="gray" size={24} />
                        <Text
                            className={`text-textPrimary text-lg ${
                                match?.teammates?.length === 0 ? "font-poppins-italic" : "font-poppins"
                            }`}
                        >
                            {match.teammates?.map((player) => player.name).join(" - ") || "No teammates"}
                        </Text>
                    </View>
                    <View className="flex-row space-x-4 items-center">
                        <OpponentIcon color="gray" size={24} />
                        <Text
                            className={`text-textPrimary text-lg ${
                                match?.opponents?.length === 0 ? "font-poppins-italic" : "font-poppins"
                            }`}
                        >
                            {match.opponents?.map((player) => player.name).join(" - ") || "No opponents"}
                        </Text>
                    </View>
                </View>
                {/* Match information */}
                <View className="flex-1 bg-surface rounded-lg p-4 shadow-sm mb-4 space-y-3">
                    <Text className="text-textSecondary text-sm font-poppins">Match information</Text>
                    <View className="flex-row space-x-4 items-center">
                        <LocationIcon color="gray" size={24} />
                        <Text className="text-textPrimary text-lg font-poppins">
                            {match?.location || "No location"}
                        </Text>
                    </View>
                    <View className="flex-row space-x-4 items-center">
                        <LevelIcon color="gray" size={24} />
                        <Text
                            className={`text-textPrimary text-lg ${
                                !match?.level ? "font-poppins-italic" : "font-poppins"
                            }`}
                        >
                            {match?.level || "Unknown"}
                        </Text>
                    </View>
                    <View className="flex-row space-x-4 items-center">
                        <SideIcon color="gray" size={24} />
                        <Text className="text-textPrimary text-lg font-poppins">{match?.side || "Right"}</Text>
                    </View>
                </View>
                {/* Comments */}
                <View className="flex-1 bg-surface rounded-lg p-4 shadow-sm mb-6 space-y-3">
                    <Text className="text-textSecondary text-sm font-poppins">Comments</Text>
                    {match?.comment && match.comment.trim().length > 0 ? (
                        <Text className="text-textPrimary text-lg font-poppins">{match.comment}</Text>
                    ) : (
                        <Text className="text-textPrimary text-lg font-poppins-italic">No comments</Text>
                    )}
                </View>
                {/* Delete */}
                <View className="flex-1 w-full h-px bg-gray-300 mb-6" />
                <View className="mb-6 flex-row items-center justify-center">
                    <DeleteMatch matchId={matchId} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

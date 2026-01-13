/* global setTimeout */
import { styled } from "nativewind";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    BackArrowIcon,
    CommentIcon,
    LevelIcon,
    LocationIcon,
    OpponentIcon,
    ResultIcon,
    SaveIcon,
    ScoreIcon,
    SideIcon,
    TeammateIcon,
} from "./Icons.jsx";
import { router } from "expo-router";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormDate } from "./FormDate.jsx";
import { FormInput } from "./FormInput.jsx";
import { FormDropdown } from "./FormDropdown.jsx";
import { useEffect, useState } from "react";
import { getPlayers } from "../services/players.js";
import { updateMatch, getMatch } from "../services/matches.js";
import Toast from "react-native-toast-message";
import { useMatches } from "../hooks/useMatches.js";
import { ErrorMessage } from "./ErrorMessage.jsx";
import { CreateMatchSkeleton } from "./CreateMatchSkeleton.jsx";
import { NewPlayer } from "./NewPlayer.jsx";

const StyledPressable = styled(Pressable);

const getEndOfToday = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return today;
};

const matchSchema = yup.object({
    date: yup
        .date()
        .max(getEndOfToday(), "Date cannot be in the future")
        .nullable()
        .transform((value, originalValue) => {
            return originalValue ? new Date(originalValue) : null;
        }),
    location: yup.string().required("Location is required"),
    level: yup.string().required("Level is required"),
    result: yup.string().required("Result is required"),
    score: yup.string(),
    teammates: yup.array().of(yup.string()),
    opponents: yup.array().of(yup.string()),
    comment: yup.string().max(1000, "Comment can't exceed 1000 characters"),
    side: yup.string().oneOf(["Right", "Left"], "Invalid side").required("Side is required"),
});

export function EditMatch({ matchId }) {
    const [players, setPlayers] = useState([]);
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const { refreshMatches } = useMatches();
    const { control, handleSubmit, reset, watch } = useForm({
        resolver: yupResolver(matchSchema),
        mode: "onChange",
        defaultValues: {
            date: new Date().toISOString(),
            location: "",
            level: "",
            result: "",
            score: "",
            side: "",
            teammates: [],
            opponents: [],
            comment: "",
        },
    });
    const formValues = watch();
    const [originalData, setOriginalData] = useState(null);
    const hasChanged = originalData && JSON.stringify(formValues) !== JSON.stringify(originalData);

    useEffect(() => {
        setLoading(true);
        setError(null);
        Promise.all([
            getPlayers().then((data) => {
                setPlayers(orderPlayersByName(data.data));
            }),
            getMatch(matchId).then((data) => {
                setMatch(data.data);
            }),
        ])
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [matchId]);

    const orderPlayersByName = (playersList) => {
        return playersList.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    };

    useEffect(() => {
        if (match) {
            const initialData = {
                date: match.date ? new Date(match.date) : new Date(),
                location: match.location || "",
                level: match.level?.toString() || "",
                result: match.result || "",
                score: match.score || "",
                side: match.side || "Right",
                teammates: match.teammates?.map((p) => p._id) || [],
                opponents: match.opponents?.map((p) => p._id) || [],
                comment: match.comment || "",
            };
            setOriginalData(initialData);
            reset(initialData);
        }
    }, [match, reset]);

    const onSubmit = async (data) => {
        setUpdating(true);
        const formattedData = formatMatch(data);
        try {
            const response = await updateMatch(matchId, formattedData);
            if (!response.data._id) {
                throw new Error("Failed to update match");
            }
            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Match updated successfully",
                position: "top",
                visibilityTime: 1500,
            });
            refreshMatches();
            await new Promise((resolve) => setTimeout(resolve, 1500));
            router.back();
        } catch (error) {
            console.error("Error updating match:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "There was an error updating the match. Please try again.",
                position: "top",
                visibilityTime: 1500,
            });
        } finally {
            setUpdating(false);
        }
    };

    const formatMatch = (data) => {
        return {
            ...data,
            date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            level: parseInt(data.level, 10),
            comment: data?.comment && data.comment.trim().length > 0 ? data.comment.trim() : null,
            score: data?.score && data.score.trim().length > 0 ? data.score.trim() : null,
        };
    };

    const handlePlayerCreated = (newPlayer) => {
        setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
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
                    <Text className="text-surface font-poppins-bold text-lg">Update Match</Text>
                    <StyledPressable
                        className="bg-surface mx-4 rounded-full h-10 w-10 items-center justify-center active:bg-gray-300 opacity-50"
                        accessibilityLabel="Save new match"
                        accessibilityHint="Saves the new match and returns to the expenses list"
                        onPress={handleSubmit(onSubmit)}
                        disabled={true}
                    >
                        <SaveIcon color="#1E40AF" />
                    </StyledPressable>
                </View>
                {/* Skeleton */}
                <ScrollView
                    className="bg-surface rounded-lg shadow-sm"
                    contentContainerStyle={{ padding: 16, gap: 12 }}
                >
                    <CreateMatchSkeleton />
                </ScrollView>
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
                    <Text className="text-surface font-poppins-bold text-lg">Update Match</Text>
                    <StyledPressable
                        className="bg-surface mx-4 rounded-full h-10 w-10 items-center justify-center active:bg-gray-300 opacity-50"
                        accessibilityLabel="Save new match"
                        accessibilityHint="Saves the new match and returns to the expenses list"
                        onPress={handleSubmit(onSubmit)}
                        disabled={true}
                    >
                        <SaveIcon color="#1E40AF" />
                    </StyledPressable>
                </View>
                {/* Error Message */}
                <ErrorMessage message={"Error loading update match"} classes={"py-0"} />
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
                    className={`bg-surface mx-4 rounded-full h-10 w-10 items-center justify-center active:bg-gray-300 ${
                        updating ? "opacity-50" : ""
                    }`}
                    accessibilityLabel="Go back to matches list"
                    accessibilityHint="Returns to the matches list without saving"
                    onPress={() => router.back()}
                    disabled={updating}
                >
                    <BackArrowIcon color="#1E40AF" />
                </StyledPressable>
                <Text className="text-surface font-poppins-bold text-lg">Update Match</Text>
                <StyledPressable
                    className={`bg-surface mx-4 rounded-full h-10 w-10 items-center justify-center active:bg-gray-300 ${
                        updating || !hasChanged ? "opacity-50" : ""
                    }`}
                    accessibilityLabel="Save new match"
                    accessibilityHint="Saves the new match and returns to the expenses list"
                    onPress={handleSubmit(onSubmit)}
                    disabled={updating || !hasChanged}
                >
                    <SaveIcon color="#1E40AF" />
                </StyledPressable>
            </View>
            {/* Scrollable form */}
            <ScrollView
                className="flex-1 bg-surface rounded-lg shadow-sm"
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Match information */}
                <Text className="text-textSecondary text-sm mb-2 font-poppins">Match information:</Text>
                <FormDate
                    control={control}
                    name="date"
                    label="Date"
                    placeholder="Select date"
                    required={false}
                    maximumDate={getEndOfToday()}
                    updating={updating}
                />
                <FormInput
                    control={control}
                    name="location"
                    label="Location"
                    placeholder="Location"
                    keyboardType="default"
                    required={true}
                    maxLength={100}
                    icon={<LocationIcon size={24} />}
                    updating={updating}
                />
                <FormDropdown
                    control={control}
                    name="level"
                    label="Category"
                    placeholder="Select Category"
                    options={Array.from({ length: 9 }, (_, i) => ({
                        _id: (i + 1).toString(),
                        name: (i + 1).toString(),
                    }))}
                    displayKey="name"
                    valueKey="_id"
                    icon={<LevelIcon />}
                    required={true}
                    updating={updating}
                />
                <FormDropdown
                    control={control}
                    name="side"
                    label="Side"
                    placeholder="Select side"
                    options={[
                        { _id: "Left", name: "Left" },
                        { _id: "Right", name: "Right" },
                    ]}
                    displayKey="name"
                    valueKey="_id"
                    icon={<SideIcon />}
                    required={true}
                    updating={updating}
                />
                {/* Players */}
                <View className="flex-1 flex-row items-center justify-between mb-2 mt-4">
                    <Text className="text-textSecondary text-sm font-poppins">Players:</Text>
                    <NewPlayer
                        players={players}
                        onCreated={handlePlayerCreated}
                        fastCreate={true}
                        updating={updating}
                    />
                </View>
                <FormDropdown
                    control={control}
                    name="teammates"
                    label="Teammates"
                    placeholder="Select teammates"
                    options={players}
                    displayKey="name"
                    valueKey="_id"
                    icon={<TeammateIcon />}
                    updating={updating}
                    multiple={true}
                />
                <FormDropdown
                    control={control}
                    name="opponents"
                    label="Opponents"
                    placeholder="Select opponents"
                    options={players}
                    displayKey="name"
                    valueKey="_id"
                    icon={<OpponentIcon />}
                    updating={updating}
                    multiple={true}
                />
                {/* Result */}
                <Text className="text-textSecondary text-sm mb-2 mt-4 font-poppins">Result:</Text>
                <FormDropdown
                    control={control}
                    name="result"
                    label="Result"
                    placeholder="Select result"
                    options={[
                        { _id: "Win", name: "Win" },
                        { _id: "Lose", name: "Lose" },
                        { _id: "Draw", name: "Draw" },
                        { _id: "DNF", name: "Did not finished" },
                    ]}
                    displayKey="name"
                    valueKey="_id"
                    icon={<ResultIcon />}
                    required={true}
                    updating={updating}
                />
                <FormInput
                    control={control}
                    name="score"
                    label="Score"
                    placeholder="Score"
                    keyboardType="default"
                    maxLength={100}
                    icon={<ScoreIcon size={24} />}
                    updating={updating}
                />
                {/* Comments */}
                <Text className="text-textSecondary text-sm mb-2 mt-4 font-poppins">Comments:</Text>
                <FormInput
                    control={control}
                    name="comment"
                    label="Comment"
                    placeholder="Comment"
                    keyboardType="default"
                    required={false}
                    maxLength={500}
                    multiline={true}
                    icon={<CommentIcon />}
                    updating={updating}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

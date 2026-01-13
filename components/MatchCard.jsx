/* global setTimeout */
import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { styled } from "nativewind";
import { LocationIcon, OpponentIcon, TeammateIcon, WinIcon, LoseIcon, UnknownIcon } from "./Icons.jsx";
import React from "react";

const StyledPressable = styled(Pressable);

export function AnimatedMatchCard({ match, index }) {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (index < 10) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                delay: index * 200,
                useNativeDriver: true,
            }).start();
        } else {
            opacity.setValue(1);
        }
    }, [opacity, index]);

    return (
        <Animated.View style={{ opacity }}>
            <MatchCard match={match} />
        </Animated.View>
    );
}

export function MatchCard({ match }) {
    const resultColors = {
        Win: "border-l-emerald-500",
        Lose: "border-l-red-500",
        Draw: "border-l-blue-500",
        DNF: "border-l-slate-400",
    };
    const resultTextColors = {
        Win: "text-emerald-700",
        Lose: "text-red-700",
        Draw: "text-blue-700",
        DNF: "text-slate-700",
    };
    const resultIcons = {
        Win: <WinIcon color="#059669" />,
        Lose: <LoseIcon color="#b91c1c" />,
        Draw: <UnknownIcon color="#1e40af" />,
        DNF: <UnknownIcon color="#78716c" />,
    };

    const opponents = match?.opponents ? match.opponents.join(" - ") : null;
    const teammates = match?.teammates ? match.teammates.join(" - ") : null;

    return (
        <Link href={`match-details/${match._id}`} asChild>
            <StyledPressable
                className={`active:opacity-60 active:scale-95 px-6 py-3 rounded-xl shadow-md shadow-black/10 border border-l-4 bg-indigo-50 border-indigo-200 ${
                    resultColors[match?.result || "DNF"] || "bg-white border-gray-200"
                }`}
            >
                {/* Header */}
                <View className="flex-row justify-between items-center">
                    <View className="flex-col justify-center items-start">
                        <Text
                            className={`font-poppins-bold text-lg ${resultTextColors[match?.result || "DNF"]} ${
                                match?.score ? "" : "font-poppins-italic"
                            }`}
                        >
                            {match?.score || "No score"}
                        </Text>
                        <Text
                            className={`font-poppins-semibold text-xs tracking-wide ${
                                resultTextColors[match?.result || "DNF"]
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
                    {resultIcons[match?.result || "DNF"]}
                </View>
                <View className="w-full h-px bg-indigo-200 my-3" />
                {/* Players */}
                {!opponents && !teammates ? (
                    <Text className="text-gray-500 text-lg font-poppins-italic mb-3">No players</Text>
                ) : (
                    <View className="mb-3 space-y-3">
                        <View className="flex-row items-center space-x-2">
                            <TeammateIcon color="gray" />
                            {match?.teammates?.length === 0 ? (
                                <Text className="text-textPrimary text-base font-poppins-italic">{"No teammates"}</Text>
                            ) : (
                                match?.teammates?.map((player) => (
                                    <View
                                        key={player._id}
                                        className="bg-green-100 border-green-200 rounded-full px-3 py-1 flex-row items-center"
                                    >
                                        <Text className="text-green-700 text-sm font-poppins-semibold">
                                            {player.name}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </View>
                        <View className="flex-row items-center space-x-2">
                            <OpponentIcon color="gray" />
                            {match?.opponents?.length === 0 ? (
                                <Text className="text-textPrimary text-base font-poppins-italic">{"No opponents"}</Text>
                            ) : (
                                match?.opponents?.map((player) => (
                                    <View
                                        key={player._id}
                                        className="bg-red-100 border-red-200 rounded-full px-3 py-1 flex-row items-center"
                                    >
                                        <Text className="text-red-700 text-sm font-poppins-semibold">
                                            {player.name}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </View>
                    </View>
                )}
                {/* Location & Level */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center space-x-2">
                        <LocationIcon color="gray" />
                        <Text className="text-textPrimary text-base font-poppins-semibold px-3">
                            {match?.location || "No location"}
                        </Text>
                    </View>
                    <View className="bg-blue-600 px-3 py-1 rounded-full">
                        <Text className="text-white font-poppins-bold text-sm">{"CAT " + (match?.level || "?")}</Text>
                    </View>
                </View>
            </StyledPressable>
        </Link>
    );
}

export function MatchCardSkeleton({ index }) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.5,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        setTimeout(() => animation.start(), index * 200);
        return () => animation.stop();
    }, [pulseAnim, index]);

    return (
        <Animated.View style={{ opacity: pulseAnim }} className="mb-3">
            <View className="px-6 py-3 rounded-xl shadow-sm bg-gray-200 border border-l-4 border-gray-300">
                {/* Header skeleton */}
                <View className="flex-row justify-between items-center">
                    <View className="w-32 h-6 bg-gray-300 rounded" />
                    <View className="w-20 h-4 bg-gray-300 rounded" />
                </View>

                <View className="w-full h-px bg-gray-400 my-3" />
                {/* Players skeleton */}
                <View className="mb-3 space-y-3">
                    <View className="flex-row items-center space-x-2">
                        <View className="w-4 h-4 bg-gray-300 rounded-full" />
                        <View className="w-40 h-4 bg-gray-300 rounded" />
                    </View>
                    <View className="flex-row items-center space-x-2">
                        <View className="w-4 h-4 bg-gray-300 rounded-full" />
                        <View className="w-36 h-4 bg-gray-300 rounded" />
                    </View>
                </View>
                {/* Location & Level skeleton */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center space-x-2">
                        <View className="w-4 h-4 bg-gray-300 rounded-full" />
                        <View className="w-24 h-4 bg-gray-300 rounded" />
                    </View>
                    <View className="w-12 h-6 bg-gray-300 rounded-full" />
                </View>
            </View>
        </Animated.View>
    );
}

export const AnimatedMatchCardMemo = React.memo(AnimatedMatchCard);
export const MatchCardMemo = React.memo(MatchCard);

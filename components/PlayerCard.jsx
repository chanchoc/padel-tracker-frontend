/* global setTimeout */
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { DeletePlayer } from "./DeletePlayer";
import { EditPlayer } from "./EditPlayer";

export function PlayerCard({ player }) {
    return (
        <View className="flex-row items-center justify-between border border-slate-300 rounded-lg shadow-sm px-4 py-2 mb-2 bg-slate-100">
            {/* Player info */}
            <View className="flex-1">
                <Text className="text-textPrimary font-poppins-bold text-lg">{player?.name}</Text>
                <Text className="text-textSecondary text-sm mt-1 font-poppins">{player?.matchCount || 0} matches</Text>
            </View>
            {/* Actions */}
            <View className="w-px h-full bg-gray-400 mx-2" />
            <View className="flex-row items-center">
                <EditPlayer playerId={player?._id} classes={"mr-4"} name={player?.name} />
                <DeletePlayer playerId={player?._id} disabled={player?.matchCount > 0} name={player?.name} />
            </View>
        </View>
    );
}

export function PlayerCardSkeleton({ index }) {
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
        <Animated.View style={{ opacity: pulseAnim }} className="items-center mb-2">
            <View className="flex-row items-center justify-between border border-slate-300 rounded-lg shadow-sm px-4 py-2 bg-gray-200">
                {/* Player info skeleton */}
                <View className="flex-1">
                    <View className="w-30 h-7 bg-gray-300 rounded mb-2" />
                    <View className="w-24 h-6 bg-gray-300 rounded" />
                </View>
                {/* Actions skeleton */}
                <View className="w-px h-8 bg-gray-300 mx-2" />
                <View className="flex-row items-center justify-center space-x-4">
                    <View className="px-3 py-3 h-8 bg-gray-300 rounded-lg min-w-[60]" />
                    <View className="px-3 py-3 h-8 bg-gray-300 rounded-lg min-w-[60]" />
                </View>
            </View>
        </Animated.View>
    );
}

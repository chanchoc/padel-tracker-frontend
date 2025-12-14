import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export function MatchDetailsSkeleton() {
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
        animation.start();

        return () => animation.stop();
    }, [pulseAnim]);

    return (
        <>
            {/* Results Skeleton */}
            <Animated.View style={{ opacity: pulseAnim }} className="mb-4">
                <View className="bg-gray-300 rounded-lg h-32" />
            </Animated.View>
            {/* Players Skeleton */}
            <Animated.View style={{ opacity: pulseAnim }} className="mb-4">
                <View className="bg-gray-300 rounded-lg p-4 space-y-3">
                    <View className="h-4 bg-gray-400 rounded w-20" />
                    <View className="h-4 bg-gray-400 rounded w-48" />
                    <View className="h-4 bg-gray-400 rounded w-44" />
                </View>
            </Animated.View>
            {/* Match Info Skeleton */}
            <Animated.View style={{ opacity: pulseAnim }} className="mb-4">
                <View className="bg-gray-300 rounded-lg p-4 space-y-3">
                    <View className="h-4 bg-gray-400 rounded w-32" />
                    <View className="h-4 bg-gray-400 rounded w-40" />
                    <View className="h-4 bg-gray-400 rounded w-36" />
                </View>
            </Animated.View>
            {/* Comments Skeleton */}
            <Animated.View style={{ opacity: pulseAnim }} className="mb-6">
                <View className="bg-gray-300 rounded-lg p-4">
                    <View className="h-4 bg-gray-400 rounded w-24 mb-2" />
                    <View className="h-4 bg-gray-400 rounded w-full mb-2" />
                    <View className="h-4 bg-gray-400 rounded w-32" />
                </View>
            </Animated.View>
            <View className="flex-1 w-full h-px bg-gray-300 mb-6" />
            {/* Delete Button Skeleton */}
            <Animated.View style={{ opacity: pulseAnim }} className="mb-6 items-center justify-center">
                <View className="h-12 bg-gray-300 rounded-full w-28" />
            </Animated.View>
        </>
    );
}

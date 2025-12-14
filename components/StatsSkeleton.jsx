import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export function StatsSkeleton() {
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
        <View className="flex-1 w-full space-y-4">
            {/* Summary Skeleton */}
            <Animated.View style={{ opacity: pulseAnim }} className="w-full mb-4">
                <View className="bg-slate-900 px-4 py-3 rounded-lg mb-3">
                    <View className="w-32 h-6 bg-gray-300 rounded" />
                </View>
                <View className="flex-row gap-3">
                    <View className="flex-1 bg-gray-300 rounded-lg h-20" />
                    <View className="flex-1 bg-gray-300 rounded-lg h-20" />
                    <View className="flex-1 bg-gray-300 rounded-lg h-20" />
                    <View className="flex-1 bg-gray-300 rounded-lg h-20" />
                </View>
            </Animated.View>
            {/* Timeline Skeleton */}
            <Animated.View style={{ opacity: pulseAnim }} className="w-full mb-4">
                <View className="bg-slate-900 px-4 py-3 rounded-lg mb-3 flex-row justify-between">
                    <View className="w-24 h-6 bg-gray-300 rounded" />
                    <View className="w-32 h-5 bg-gray-300 rounded" />
                </View>
                <View className="space-y-3">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <View key={index}>
                            <View className="flex-row justify-between mb-2">
                                <View className="w-20 h-4 bg-gray-300 rounded" />
                                <View className="w-16 h-4 bg-gray-300 rounded" />
                            </View>
                            <View className="w-full h-10 bg-gray-300 rounded-lg" />
                        </View>
                    ))}
                </View>
            </Animated.View>
            {/* Head to Head Skeleton */}
            <Animated.View style={{ opacity: pulseAnim }} className="w-full">
                <View className="bg-slate-900 px-4 py-3 rounded-lg mb-3">
                    <View className="w-32 h-6 bg-gray-300 rounded" />
                </View>
                <View className="bg-gray-200 rounded-lg overflow-hidden">
                    {/* Header */}
                    <View className="flex-row bg-gray-300 px-4 py-3 gap-2">
                        <View className="flex-1 h-4 bg-gray-400 rounded" />
                        <View className="w-12 h-4 bg-gray-400 rounded" />
                        <View className="w-10 h-4 bg-gray-400 rounded" />
                        <View className="w-10 h-4 bg-gray-400 rounded" />
                        <View className="w-14 h-4 bg-gray-400 rounded" />
                    </View>
                    {/* Rows */}
                    {[0, 1, 2, 3].map((index) => (
                        <View key={index} className="flex-row px-4 py-3 gap-2 border-b border-gray-300">
                            <View className="flex-1 h-4 bg-gray-300 rounded" />
                            <View className="w-12 h-4 bg-gray-300 rounded" />
                            <View className="w-10 h-4 bg-gray-300 rounded" />
                            <View className="w-10 h-4 bg-gray-300 rounded" />
                            <View className="w-14 h-4 bg-gray-300 rounded" />
                        </View>
                    ))}
                </View>
            </Animated.View>
        </View>
    );
}

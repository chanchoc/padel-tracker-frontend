import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../../hooks/useAuth.js";
import { Redirect } from "expo-router";
import { Stats } from "../../components/Stats.jsx";

export default function StatsTab() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#1E40AF" />
                <Text className="mt-4 text-primary text-xl font-bold">Loading...</Text>
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/auth/login" />;
    }

    return <Stats />;
}

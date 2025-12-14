import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useAuth } from "../../hooks/useAuth.js";
import { Redirect } from "expo-router";
import { Profile } from "../../components/Profile.jsx";
import { Logout } from "../../components/Logout.jsx";

export default function ProfileTab() {
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

    return (
        <ScrollView className="flex-1 bg-background px-6">
            <Profile />
            <View className="flex-1 w-full h-px bg-gray-300 mb-6" />
            <View className="flex-1 items-center justify-center">
                <Logout />
            </View>
        </ScrollView>
    );
}

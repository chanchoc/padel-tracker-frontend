import { ScrollView, View } from "react-native";
import { useAuth } from "../../hooks/useAuth.js";
import { Redirect } from "expo-router";
import { Profile } from "../../components/Profile.jsx";
import { Logout } from "../../components/Logout.jsx";
import { AuthLoading } from "../../components/AuthLoading.jsx";

export default function ProfileTab() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <AuthLoading />;
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

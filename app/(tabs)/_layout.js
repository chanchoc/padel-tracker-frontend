import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { StatsIcon, TennisIcon, UserIcon } from "../../components/Icons.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { AuthLoading } from "../../components/AuthLoading.jsx";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    const insets = useSafeAreaInsets();

    if (isLoading) {
        return <AuthLoading />;
    }

    if (!isAuthenticated) {
        return <Redirect href="/auth/login" />;
    }

    if (isAuthenticated) {
        return (
            <Tabs
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: "#0F172A",
                        borderTopColor: "#1E293B",
                        borderTopWidth: 1,
                        height: 65 + insets.bottom,
                        paddingBottom: insets.bottom + 12,
                        paddingTop: 12,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -3 },
                        shadowOpacity: 0.25,
                        shadowRadius: 12,
                        elevation: 12,
                    },
                    tabBarIconStyle: {
                        marginBottom: 2,
                    },
                    tabBarItemStyle: {
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        paddingVertical: 4,
                    },
                    tabBarInactiveTintColor: "#64748B",
                    tabBarActiveTintColor: "#3B82F6",
                    tabBarShowLabel: false,
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontFamily: "Poppins-SemiBold",
                        fontWeight: "bold",
                        marginTop: 2,
                    },
                    headerStyle: {
                        backgroundColor: "#0F172A",
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: "#1E293B",
                    },
                    headerTintColor: "#FFFFFF",
                    headerTitleStyle: {
                        fontFamily: "Poppins-Bold",
                        fontSize: 20,
                        letterSpacing: 0.3,
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        headerTitle: "My Matches",
                        tabBarIcon: ({ color }) => <TennisIcon size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="stats"
                    options={{
                        headerTitle: "My Stats",
                        tabBarIcon: ({ color }) => <StatsIcon size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        headerTitle: "My Profile",
                        tabBarIcon: ({ color }) => <UserIcon size={24} color={color} />,
                    }}
                />
            </Tabs>
        );
    }

    return (
        <View className="flex-1 justify-center items-center bg-background px-6">
            <ActivityIndicator size="large" color="#1F2937" />
            <Text className="mt-4 text-textPrimary text-xl font-bold">Loading...</Text>
        </View>
    );
}

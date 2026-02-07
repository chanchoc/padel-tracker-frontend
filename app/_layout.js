import { Stack, usePathname } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext.js";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { MatchesProvider } from "../contexts/MatchesContext.js";
import { PlayersProvider } from "../contexts/PlayersContext.js";
import { useFonts } from "expo-font";
import { AuthLoading } from "../components/AuthLoading.jsx";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Keep splash visible while fonts load
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
    const pathName = usePathname();
    const isLightScreen = pathName.includes("/auth");
    const [fontsLoaded, fontError] = useFonts({
        Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Italic": require("../assets/fonts/Poppins-Italic.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-SemiBoldItalic": require("../assets/fonts/Poppins-SemiBoldItalic.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-BoldItalic": require("../assets/fonts/Poppins-BoldItalic.ttf"),
        FontAwesome: require("../assets/fonts/FontAwesome.ttf"),
    });

    useEffect(() => {
        if (fontError) {
            SplashScreen.hideAsync().catch(() => {});
        }
    }, [fontError]);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                {!fontsLoaded && !fontError ? (
                    <AuthLoading />
                ) : (
                    <AuthProvider>
                        <MatchesProvider>
                            <PlayersProvider>
                                <StatusBar style={isLightScreen ? "dark" : "light"} />
                                <Stack
                                    screenOptions={{
                                        headerShown: false,
                                    }}
                                />
                                <Toast />
                            </PlayersProvider>
                        </MatchesProvider>
                    </AuthProvider>
                )}
            </View>
        </SafeAreaProvider>
    );
}

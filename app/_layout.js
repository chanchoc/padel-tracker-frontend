import { Stack, usePathname } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext.js";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { MatchesProvider } from "../contexts/MatchesContext.js";
import { PlayersProvider } from "../contexts/PlayersContext.js";
import { useFonts } from "expo-font";
import { AuthLoading } from "../components/AuthLoading.jsx";

export default function RootLayout() {
    const pathName = usePathname();
    const isLightScreen = pathName.includes("/auth");
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-RegularItalic": require("../assets/fonts/Poppins-Italic.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-SemiBoldItalic": require("../assets/fonts/Poppins-SemiBoldItalic.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-BoldItalic": require("../assets/fonts/Poppins-BoldItalic.ttf"),
    });

    if (!fontsLoaded) {
        return <AuthLoading />;
    }

    return (
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
    );
}

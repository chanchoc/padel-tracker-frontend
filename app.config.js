import "dotenv/config";

export default {
    expo: {
        name: "Padel Tracker",
        slug: "frontend",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "padeltracker",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        splash: {
            image: "./assets/images/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
            package: "com.chanchoc.frontend",
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png",
        },
        assetBundlePatterns: ["**/*"],
        plugins: [
            "expo-router",
            "expo-secure-store",
            "expo-asset",
            [
                "expo-font",
                {
                    fonts: [
                        "./assets/fonts/Poppins-Regular.ttf",
                        "./assets/fonts/Poppins-Italic.ttf",
                        "./assets/fonts/Poppins-SemiBold.ttf",
                        "./assets/fonts/Poppins-SemiBoldItalic.ttf",
                        "./assets/fonts/Poppins-Bold.ttf",
                        "./assets/fonts/Poppins-BoldItalic.ttf",
                        "./assets/fonts/FontAwesome.ttf",
                    ],
                },
            ],
            [
                "expo-build-properties",
                {
                    android: {
                        compileSdkVersion: 35,
                        targetSdkVersion: 35,
                        buildToolsVersion: "35.0.0",
                    },
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            router: {
                origin: false,
            },
            eas: {
                projectId: "c77ff112-a3ec-4fa1-8dbb-840dbd440fd3",
            },
        },
        owner: "chanchoc",
    },
};

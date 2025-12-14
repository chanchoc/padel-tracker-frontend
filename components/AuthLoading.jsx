import { View, Image, Text } from "react-native";

export function AuthLoading() {
    return (
        <View className="flex-1 justify-center items-center bg-background">
            <Image source={require("../assets/images/icon.png")} style={{ width: 120, height: 120 }} />
            <Text className="mt-6 text-textPrimary text-lg font-poppins-semibold">Loading...</Text>
            <Text className="mt-2 text-textSecondary text-sm font-poppins">Preparing your matches</Text>
        </View>
    );
}

import { Text, View } from "react-native";

export function ErrorMessage({ message, classes }) {
    return (
        <View className={`py-6 items-center justify-center ${classes}`}>
            <View className="w-full bg-red-50 border-2 border-red-400 rounded-lg p-8 items-center">
                <Text className="text-4xl mb-4 font-poppins">⚠️</Text>
                <Text className="text-red-700 text-2xl font-poppins-bold text-center mb-2">Oops!</Text>
                <Text className="text-red-600 text-base text-center font-poppins">
                    {message || "Error loading page"}
                </Text>
            </View>
        </View>
    );
}

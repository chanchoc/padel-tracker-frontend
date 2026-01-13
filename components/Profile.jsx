import { Animated, Text, View } from "react-native";
import { UserIcon } from "./Icons.jsx";
import { useEffect, useRef, useState } from "react";
import { getUser } from "../services/users.js";
import { ErrorMessage } from "./ErrorMessage.jsx";
import { DeleteAccount } from "./DeleteAccount.jsx";

export function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        let animation;
        if (loading) {
            animation = Animated.loop(
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
        }
        return () => {
            if (animation) {
                animation.stop();
            }
        };
    }, [loading, pulseAnim]);

    useEffect(() => {
        getUser()
            .then((data) => {
                setUser(data.data);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <View className="mb-6">
                <View className="items-center justify-center bg-background py-6">
                    <Animated.View style={{ opacity: pulseAnim }} className="w-24 h-24 bg-gray-300 rounded-full" />
                    <Animated.View style={{ opacity: pulseAnim }} className="w-32 h-6 bg-gray-300 rounded mt-3" />
                </View>
                <Animated.View style={{ opacity: pulseAnim }} className="bg-gray-300 rounded-lg h-16 mb-4" />
                <Animated.View style={{ opacity: pulseAnim }} className="bg-gray-300 rounded-lg h-16" />
            </View>
        );
    }

    if (error) {
        return <ErrorMessage message={"Error loading your profile"} />;
    }

    return (
        <View className="mb-6">
            <View className="items-center justify-center bg-background py-6">
                <View className="w-24 h-24 bg-primary rounded-full items-center justify-center shadow-lg">
                    <UserIcon size={48} color="white" />
                </View>
                <Text className="text-textPrimary text-2xl font-poppins-bold mt-3 capitalize w-full text-center">
                    {user.name || "User Name"}
                </Text>
                <DeleteAccount />
            </View>
            <View className="flex-1">
                <View className="flex-1 bg-surface rounded-lg p-4 mb-4 shadow-sm">
                    <Text className="text-textSecondary text-sm mb-1 font-poppins">Email</Text>
                    <Text className="text-textPrimary text-lg font-poppins">{user.email || "No email"}</Text>
                </View>
                <View className="flex-1 bg-surface rounded-lg p-4 shadow-sm">
                    <Text className="text-textSecondary text-sm mb-1 font-poppins">Member since</Text>
                    <Text className="text-textPrimary text-lg font-poppins">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </Text>
                </View>
            </View>
        </View>
    );
}

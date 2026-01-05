/* global setTimeout */
import { Text, View, Pressable } from "react-native";
import { styled } from "nativewind";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormUserInput } from "./FormUserInput.jsx";
import { EmailIcon, PasswordIcon } from "./Icons.jsx";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useState } from "react";
import { login } from "../services/auth.js";
import { useAuth } from "../hooks/useAuth.js";

const StyledPressable = styled(Pressable);

const loginSchema = yup.object({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });
    const { login: setAuthState } = useAuth();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const normalizedEmail = data.email.replace(/＠/g, "@").replace(/．/g, ".").toLowerCase().trim();
            const password = data.password;
            const response = await login(normalizedEmail, password);
            if (!response.success) {
                throw new Error("Login failed");
            }
            setAuthState();
            Toast.show({
                type: "success",
                text1: "Succesful login!",
                text2: "Redirecting to home...",
                position: "top",
                visibilityTime: 1500,
            });
            await new Promise((resolve) => setTimeout(resolve, 1500));
            router.replace("/(tabs)");
        } catch (error) {
            console.log("Login error:", error);
            Toast.show({
                type: "error",
                text1: "Login failed",
                text2: "Email or password is incorrect",
                position: "top",
                visibilityTime: 1500,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-background px-6">
            <Text className="text-textPrimary text-3xl font-poppins-bold mb-8">Login to your account</Text>
            <FormUserInput
                name="email"
                placeholder="Email"
                control={control}
                icon={<EmailIcon size={30} />}
                error={errors.email ? true : false}
                disabled={isLoading}
                comment={errors.email?.message}
            />
            <FormUserInput
                name="password"
                placeholder="Password"
                control={control}
                icon={<PasswordIcon size={27} />}
                error={errors.password ? true : false}
                disabled={isLoading}
                comment={errors.password?.message}
            />
            <StyledPressable
                className={`bg-primary py-3 px-6 rounded-xl ${isLoading ? "bg-gray-400" : "active:opacity-70"}`}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
            >
                <Text className="text-white text-lg text-center font-poppins-bold">
                    {isLoading ? "Logging in..." : "Login"}
                </Text>
            </StyledPressable>
            <View className="w-full h-px bg-gray-300 my-4" />
            <View className="items-center">
                <Text className="text-textSecondary text-center mb-2 font-poppins">No account?</Text>
                <Pressable
                    onPress={() => router.replace("/auth/register")}
                    disabled={isLoading}
                    className={isLoading ? "opacity-50" : ""}
                >
                    <Text className="text-primary font-poppins-semibold text-lg text-center">Create free account</Text>
                </Pressable>
            </View>
        </View>
    );
}

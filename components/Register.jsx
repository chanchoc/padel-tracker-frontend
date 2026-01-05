/* global setTimeout */
import { Pressable, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import { styled } from "nativewind";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormUserInput } from "./FormUserInput.jsx";
import { EmailIcon, PasswordIcon, UserIcon } from "./Icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { register } from "../services/auth.js";
import { useState } from "react";

const StyledPressable = styled(Pressable);

const registerSchema = yup.object({
    name: yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
    email: yup
        .string()
        .matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/, "Password must contain letters and numbers")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});

export function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const name = data.name.trim();
            const normalizedEmail = data.email.replace(/＠/g, "@").replace(/．/g, ".").toLowerCase().trim();
            const password = data.password;
            const userData = { name, email: normalizedEmail, password };
            const response = await register(userData);
            if (!response.success) {
                throw new Error("Register failed");
            }
            Toast.show({
                type: "success",
                text1: "Succesful registration!",
                text2: "Redirecting to login...",
                position: "top",
                visibilityTime: 1500,
            });
            await new Promise((resolve) => setTimeout(resolve, 1500));
            router.replace("/auth/login");
        } catch (error) {
            console.log("Register error:", error);
            Toast.show({
                type: "error",
                text1: "Register failed",
                text2: "User already exists or invalid data",
                position: "top",
                visibilityTime: 1500,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-background px-6">
            <Text className="text-textPrimary text-3xl font-poppins-bold mb-8">Create new account</Text>
            <FormUserInput
                name="name"
                placeholder="Username"
                control={control}
                icon={<UserIcon size={30} />}
                error={errors.name ? true : false}
                disabled={isLoading}
                comment={errors.name?.message}
            />
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
            <FormUserInput
                name="confirmPassword"
                placeholder="Confirm Password"
                control={control}
                icon={<PasswordIcon size={27} />}
                error={errors.confirmPassword ? true : false}
                disabled={isLoading}
                comment={errors.confirmPassword?.message}
            />
            <StyledPressable
                className={`bg-primary py-3 px-6 rounded-xl ${isLoading ? "bg-gray-400" : "active:opacity-70"}`}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
            >
                <Text className="text-white text-lg text-center font-poppins-bold">
                    {isLoading ? "Creating account..." : "Create account"}
                </Text>
            </StyledPressable>
            <View className="w-full h-px bg-gray-300 my-4" />
            <View className="items-center">
                <Text className="text-textSecondary text-center mb-2 font-poppins">Already have an account?</Text>
                <Pressable
                    onPress={() => router.replace("/auth/login")}
                    disabled={isLoading}
                    className={isLoading ? "opacity-50" : ""}
                >
                    <Text className="text-primary font-poppins-semibold text-lg text-center">
                        Login to your account
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

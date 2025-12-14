import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { styled } from "nativewind";
import { useController } from "react-hook-form";

const StyledTextInput = styled(TextInput);

export function FormInput({
    control,
    name,
    label,
    placeholder,
    keyboardType = "default",
    required = false,
    maxLength,
    icon,
    multiline = false,
    updating = false,
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);

    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        control,
        name,
    });

    return (
        <View className="mb-4">
            {/* Label */}
            <View className="flex-row items-center mb-1">
                <Text className="text-textPrimary font-poppins-semibold text-base">{label}</Text>
                {required && <Text className="text-red-600 ml-1 font-poppins">*</Text>}
            </View>
            {/* Input Container */}
            <View
                className={`bg-slate-100 flex-row items-center justify-start space-x-4 rounded-xl py-3 px-4 border ${
                    error ? "border-red-600" : isFocused ? "border-primary" : "border-border"
                } ${error ? "bg-red-50/30" : ""} ${updating ? "opacity-50" : ""}`}
            >
                {React.cloneElement(icon, { color: error ? "red" : "#6B7280" })}
                <View className="w-px h-full bg-gray-400" />
                <StyledTextInput
                    value={value || ""}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 text-textPrimary text-base font-poppins p-0"
                    multiline={multiline}
                    textAlignVertical={multiline ? "top" : "center"}
                    editable={!updating}
                    {...props}
                />
            </View>
            {/* Error Message from Yup*/}
            {error && (
                <View className="pt-1">
                    <Text className="text-red-600 text-xs">{error.message}</Text>
                </View>
            )}
        </View>
    );
}

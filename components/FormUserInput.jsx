import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

export function FormUserInput({
    name,
    control,
    placeholder,
    icon,
    disabled = false,
    comment = null,
    multiline = false,
    error = false,
}) {
    const passwords = ["password", "confirmPassword"];
    const [isFocused, setIsFocused] = useState(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <View className="w-full mb-4">
                    <View
                        className={`flex-row border 
                            ${error ? "border-red-600" : isFocused ? "border-primary" : "border-border"} 
                            rounded-xl py-3 px-4 items-center space-x-4 bg-slate-100 
                            ${disabled ? "opacity-50" : ""}`}
                    >
                        {React.cloneElement(icon, { color: error ? "red" : "#6B7280" })}
                        <View className="w-px h-full bg-gray-400" />
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            placeholder={placeholder}
                            placeholderTextColor={error ? "red" : "#9CA3AF"}
                            multiline={multiline}
                            textAlignVertical={multiline ? "top" : "center"}
                            className={`flex-1 text-lg p-0 ${multiline ? "min-h-32" : ""} font-poppins`}
                            secureTextEntry={passwords.includes(name) ? true : false}
                            editable={!disabled}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    </View>
                    <Text
                        className={`${comment ? "" : "hidden"} pt-1 pl-1 text-xs ${
                            error ? "text-red-600" : "text-textLight font-poppins"
                        }`}
                    >
                        {comment}
                    </Text>
                </View>
            )}
        ></Controller>
    );
}

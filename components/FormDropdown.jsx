import { styled } from "nativewind";
import React, { useState } from "react";
import { useController } from "react-hook-form";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { DropdownIcon } from "./Icons";

const StyledPressable = styled(Pressable);

export function FormDropdown({
    control,
    name,
    label,
    labelClass,
    placeholder,
    textClass,
    options = [],
    displayKey = "name",
    valueKey = "_id",
    icon,
    required = false,
    updating = false,
    multiple = false,
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        control,
        name,
    });
    const selectedItems = multiple
        ? options.filter((item) => value?.includes(item[valueKey]))
        : [options.find((item) => item[valueKey] === value)].filter(Boolean);

    const handleSelect = (item) => {
        if (multiple) {
            const newValue = value?.includes(item[valueKey])
                ? value.filter((id) => id !== item[valueKey])
                : [...(value || []), item[valueKey]];
            onChange(newValue);
        } else {
            onChange(item[valueKey]);
        }
        setIsOpen(false);
        setIsFocused(false);
    };

    const displayText = multiple
        ? selectedItems.length > 0
            ? selectedItems.map((item) => item[displayKey]).join(", ")
            : placeholder
        : selectedItems[0]?.[displayKey] || placeholder;

    return (
        <View className="mb-4 justify-center">
            {/* Label */}
            <View className="flex-row items-center mb-1">
                <Text className={`${labelClass ? labelClass : "text-textPrimary font-poppins-semibold text-base"}`}>
                    {label}
                </Text>
                {required && <Text className="text-red-600 ml-1 font-poppins">*</Text>}
            </View>
            {/* Dropdown Button */}
            <StyledPressable
                onPress={() => {
                    setIsOpen(true);
                    setIsFocused(true);
                }}
                className={`bg-slate-100 rounded-lg border py-3 px-4 flex-row space-x-4 justify-start items-center active:opacity-70 ${
                    error ? "border-red-600 bg-red-50/30" : isFocused ? "border-primary" : "border-border"
                } ${options.length === 0 || updating ? "opacity-50" : ""}`}
                disabled={options.length === 0 || updating}
            >
                {React.cloneElement(icon, { color: error ? "red" : "#6B7280" })}
                <View className="w-px h-full bg-gray-400" />
                <View className="flex-1 justify-center">
                    {multiple && selectedItems.length > 0 ? (
                        <View className="flex-row flex-wrap gap-2">
                            {selectedItems.map((item) => (
                                <View
                                    key={item[valueKey]}
                                    className="bg-primary/20 rounded-full px-3 py-1 flex-row items-center space-x-2"
                                >
                                    <Text className="text-primary text-xs font-poppins-semibold">
                                        {item[displayKey]}
                                    </Text>
                                    <Pressable onPress={() => handleSelect(item)}>
                                        <Text className="text-primary font-poppins-bold">×</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text
                            className={`${textClass ? textClass : "text-base"} font-poppins ${
                                selectedItems.length > 0 ? "text-textPrimary" : "text-gray-400"
                            }`}
                        >
                            {displayText}
                        </Text>
                    )}
                </View>
                <DropdownIcon color={error ? "#EF4444" : isFocused ? "#1E40AF" : "#9CA3AF"} size={15} />
            </StyledPressable>
            {/* Modal with options */}
            <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
                <Pressable
                    className="flex-1 bg-black/50 justify-center items-center px-6"
                    onPress={() => {
                        setIsOpen(false);
                        setIsFocused(false);
                    }}
                >
                    <View className="bg-slate-100 rounded-lg max-h-96 w-full shadow-lg">
                        {/* Header */}
                        <View className="p-4 border-b border-border">
                            <Text className="text-textPrimary font-poppins-semibold text-lg">Select {label}</Text>
                        </View>
                        {/* Options List */}
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item[valueKey]}
                            renderItem={({ item }) => (
                                <StyledPressable
                                    onPress={() => handleSelect(item)}
                                    className={`p-4 border-b border-gray-100 active:bg-gray-100 ${
                                        multiple
                                            ? value?.includes(item[valueKey])
                                                ? "bg-primary/10"
                                                : ""
                                            : item[valueKey] === value
                                            ? "bg-primary/10"
                                            : ""
                                    }`}
                                >
                                    <View className="flex-row items-center">
                                        {/* Icon if exists */}
                                        {item.symbol && <Text className="text-xl mr-3">{item.symbol}</Text>}
                                        <View className="flex-1">
                                            <Text
                                                className={`font-poppins text-base capitalize ${
                                                    multiple
                                                        ? value?.includes(item[valueKey])
                                                            ? "text-primary"
                                                            : "text-textPrimary"
                                                        : item[valueKey] === value
                                                        ? "text-primary"
                                                        : "text-textPrimary"
                                                }`}
                                            >
                                                {item[displayKey].replace(/_/g, " ")}
                                            </Text>
                                        </View>
                                        {/* Checkmark for selected */}
                                        {(multiple ? value?.includes(item[valueKey]) : item[valueKey] === value) && (
                                            <Text className="text-primary text-xl font-poppins">✓</Text>
                                        )}
                                    </View>
                                </StyledPressable>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
            {/* Error Message from Yup*/}
            {error && (
                <View className="mt-2">
                    <Text className="text-red-600 text-xs font-poppins">{error.message}</Text>
                </View>
            )}
        </View>
    );
}

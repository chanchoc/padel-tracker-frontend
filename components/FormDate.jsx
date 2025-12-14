import { styled } from "nativewind";
import { useState } from "react";
import { useController } from "react-hook-form";
import { Modal, Platform, Pressable, Text, View } from "react-native";
import { CalendarIcon } from "./Icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const StyledPressable = styled(Pressable);

export function FormDate({
    control,
    name,
    label,
    placeholder,
    required = false,
    maxDate = new Date(),
    updating = false,
    ...props
}) {
    const [showPicker, setShowPicker] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        control,
        name,
    });

    const selectedDate = value ? new Date(value) : null;

    const handleDateChange = (event, selectedDate) => {
        if (Platform.OS === "android") {
            setShowPicker(false);
            setIsFocused(false);
        }
        if (selectedDate) {
            onChange(selectedDate.toISOString());
        }
    };

    const handleIOSConfirm = () => {
        setShowPicker(false);
        setIsFocused(false);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <View className="mb-4">
            {/* Label */}
            <View className="flex-row items-center mb-1">
                <Text className="text-text-primary font-poppins-semibold text-base">{label}</Text>
                {required && <Text className="text-red-600 ml-1 font-poppins">*</Text>}
            </View>
            {/* Date Button */}
            <StyledPressable
                onPress={() => {
                    setShowPicker(true);
                    setIsFocused(true);
                }}
                className={`bg-slate-100 rounded-xl border py-3 px-4 flex-row space-x-4 justify-start items-center active:opacity-70 ${
                    error ? "border-red-600 bg-red-50/30" : isFocused ? "border-primary" : "border-border"
                } ${updating ? "opacity-50" : ""}`}
                disabled={updating}
            >
                <CalendarIcon color={error ? "#EF4444" : isFocused ? "#1E40AF" : "#6B7280"} />
                <View className="w-px h-full bg-gray-400" />
                <Text className={`text-base font-poppins ${selectedDate ? "text-textPrimary" : "text-gray-400"}`}>
                    {selectedDate ? formatDate(selectedDate) : placeholder}
                </Text>
            </StyledPressable>
            {/* Date Picker */}
            {showPicker && (
                <>
                    {Platform.OS === "ios" ? (
                        <Modal
                            visible={showPicker}
                            transparent
                            animationType="slide"
                            onRequestClose={() => {
                                setShowPicker(false);
                                setIsFocused(false);
                            }}
                        >
                            <View className="flex-1 bg-black/50 justify-end">
                                <View className="bg-surface">
                                    {/* iOS Header */}
                                    <View className="flex-row justify-between items-center p-4 border-b border-border">
                                        <StyledPressable
                                            onPress={() => {
                                                setShowPicker(false);
                                                setIsFocused(false);
                                            }}
                                            className="active:opacity-70"
                                        >
                                            <Text className="text-red-600 font-poppins text-lg">Cancel</Text>
                                        </StyledPressable>
                                        <Text className="text-textPrimary font-poppins-semibold text-lg">
                                            Select {label}
                                        </Text>
                                        <StyledPressable onPress={handleIOSConfirm} className="active:opacity-70">
                                            <Text className="text-primary font-poppins text-lg">Done</Text>
                                        </StyledPressable>
                                    </View>

                                    {/* iOS Picker */}
                                    <DateTimePicker
                                        value={selectedDate || new Date()}
                                        mode="date"
                                        display="spinner"
                                        onChange={handleDateChange}
                                        maximumDate={maxDate}
                                        style={{ backgroundColor: "white" }}
                                    />
                                </View>
                            </View>
                        </Modal>
                    ) : (
                        // Android Picker
                        <DateTimePicker
                            value={selectedDate || new Date()}
                            mode="date"
                            display="calendar"
                            onChange={handleDateChange}
                            maximumDate={maxDate}
                        />
                    )}
                </>
            )}
            {/* Error Message from Yup*/}
            {error && (
                <View className="pt-1">
                    <Text className="text-red-600 text-xs font-poppins">{error.message}</Text>
                </View>
            )}
        </View>
    );
}

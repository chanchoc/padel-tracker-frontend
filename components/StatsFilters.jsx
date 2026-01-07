import { styled } from "nativewind";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Controller } from "react-hook-form";
import { FormDate } from "./FormDate";
import { FormDropdown } from "./FormDropdown";
import { OpponentIcon, TeammateIcon } from "./Icons";

const StyledPressable = styled(Pressable);

const getEndOfToday = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return today;
};

export function StatsFilters({ visible, onClose, control, onApply, onClear, players }) {
    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 bg-black/50 justify-center items-center px-6">
                <View className="bg-white rounded-xl p-6 w-full max-w-sm max-h-[70vh] flex-1 flex-col">
                    {/* Header con título y botón cerrar */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-poppins-bold text-textPrimary">Filters</Text>
                        <Pressable onPress={onClose} className="w-8 h-8 items-center justify-center">
                            <Text className="text-2xl text-gray-500">×</Text>
                        </Pressable>
                    </View>
                    {/* Contenido scrolleable */}
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        {/* Sección Fechas */}
                        <View className="mb-4">
                            <Text className="text-base font-poppins-semibold text-textSecondary mb-3">Date Range</Text>
                            <FormDate
                                control={control}
                                name="startDate"
                                label="From:"
                                labelClass="text-xs text-textLight mb-2"
                                placeholder="Select from date"
                                textClass="text-sm"
                                required={false}
                                maximumDate={getEndOfToday()}
                                deletable={true}
                            />
                            <FormDate
                                control={control}
                                name="endDate"
                                label="To:"
                                labelClass="text-xs text-textLight mb-2"
                                placeholder="Select to date"
                                textClass="text-sm"
                                required={false}
                                maximumDate={getEndOfToday()}
                                deletable={true}
                            />
                        </View>
                        {/* Sección Jugadores */}
                        <View className="mb-4">
                            <Text className="text-base font-poppins-semibold text-textSecondary mb-3">Players</Text>
                            {/* Dropdown Oponentes */}
                            <FormDropdown
                                control={control}
                                name="opponents"
                                label="Opponents (any):"
                                labelClass="text-xs text-textLight mb-2"
                                placeholder="Select opponents"
                                textClass="text-sm"
                                options={players}
                                displayKey="name"
                                valueKey="_id"
                                icon={<OpponentIcon />}
                                multiple={true}
                            />
                            {/* Dropdown Compañeros */}
                            <FormDropdown
                                control={control}
                                name="teammates"
                                label="Teammates (any):"
                                labelClass="text-xs text-textLight mb-2"
                                placeholder="Select teammates"
                                textClass="text-sm"
                                options={players}
                                displayKey="name"
                                valueKey="_id"
                                icon={<TeammateIcon />}
                                multiple={true}
                            />
                        </View>
                        {/* Sección Nivel */}
                        <View className="mb-4">
                            <Text className="text-base font-poppins-semibold text-textSecondary mb-3">Level</Text>
                            <Controller
                                control={control}
                                name="level"
                                defaultValue={null}
                                render={({ field: { value, onChange } }) => (
                                    <View className="flex-row gap-2 flex-wrap">
                                        {[
                                            { label: "1-3", value: "1-3" },
                                            { label: "4-6", value: "4-6" },
                                            { label: "7-9", value: "7-9" },
                                            { label: "All", value: null },
                                        ].map((option) => (
                                            <StyledPressable
                                                key={option.label}
                                                onPress={() => onChange(option.value)}
                                                className={`flex-1 py-2 rounded-lg border ${
                                                    value === option.value
                                                        ? "bg-primary border-primary"
                                                        : "border-border bg-slate-100"
                                                } items-center`}
                                            >
                                                <Text
                                                    className={`font-poppins-semibold ${
                                                        value === option.value ? "text-white" : "text-textSecondary"
                                                    }`}
                                                >
                                                    {option.label}
                                                </Text>
                                            </StyledPressable>
                                        ))}
                                    </View>
                                )}
                            />
                        </View>
                        {/* Sección lado */}
                        <View>
                            <Text className="text-base font-poppins-semibold text-textSecondary mb-3">Side</Text>
                            <Controller
                                control={control}
                                name="side"
                                defaultValue={null}
                                render={({ field: { value, onChange } }) => (
                                    <View className="flex-row gap-2 flex-wrap">
                                        {[
                                            { label: "Left", value: "Left" },
                                            { label: "Right", value: "Right" },
                                            { label: "Any", value: null },
                                        ].map((option) => (
                                            <StyledPressable
                                                key={option.label}
                                                onPress={() => onChange(option.value)}
                                                className={`flex-1 py-2 rounded-lg border ${
                                                    value === option.value
                                                        ? "bg-primary border-primary"
                                                        : "border-border bg-slate-100"
                                                } items-center`}
                                            >
                                                <Text
                                                    className={`font-poppins-semibold ${
                                                        value === option.value ? "text-white" : "text-textSecondary"
                                                    }`}
                                                >
                                                    {option.label}
                                                </Text>
                                            </StyledPressable>
                                        ))}
                                    </View>
                                )}
                            />
                        </View>
                    </ScrollView>
                    {/* Options */}
                    <View className="flex-row gap-4 mt-4 border-t border-gray-200">
                        <StyledPressable
                            className="flex-1 bg-gray-200 py-3 rounded-xl active:opacity-70"
                            onPress={onClear}
                        >
                            <Text className="text-gray-800 text-center font-poppins-semibold">Clear</Text>
                        </StyledPressable>
                        <StyledPressable
                            className="flex-1 bg-primary py-3 rounded-xl active:opacity-70"
                            onPress={onApply}
                        >
                            <Text className="text-white text-center font-poppins-semibold">Apply</Text>
                        </StyledPressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

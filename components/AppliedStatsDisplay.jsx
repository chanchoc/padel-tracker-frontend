import { Text, View } from "react-native";

export function AppliedFiltersDisplay({ appliedFilters }) {
    const hasActiveFilters = () => {
        return (
            appliedFilters.fromDate ||
            appliedFilters.endDate ||
            appliedFilters.level ||
            appliedFilters.side ||
            appliedFilters.opponents?.length > 0 ||
            appliedFilters.teammates?.length > 0
        );
    };

    const getActiveFilterChips = () => {
        const chips = [];

        if (appliedFilters.startDate) {
            chips.push({ label: `From: ${formatDate(appliedFilters.startDate)}`, key: "startDate" });
        }
        if (appliedFilters.endDate) {
            chips.push({ label: `To: ${formatDate(appliedFilters.endDate)}`, key: "endDate" });
        }
        if (appliedFilters.level) {
            chips.push({ label: `Level: ${appliedFilters.level}`, key: "level" });
        }
        if (appliedFilters.side) {
            chips.push({ label: `Side: ${appliedFilters.side}`, key: "side" });
        }
        if (appliedFilters.opponents?.length > 0) {
            chips.push({ label: `Opponents: ${appliedFilters.opponents.length}`, key: "opponents" });
        }
        if (appliedFilters.teammates?.length > 0) {
            chips.push({ label: `Teammates: ${appliedFilters.teammates.length}`, key: "teammates" });
        }
        return chips;
    };

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString("en-US", {
            weekday: undefined,
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    if (!hasActiveFilters()) {
        return null;
    }

    const chips = getActiveFilterChips();

    return (
        <View className="items-center justify-center bg-blue-50 rounded-lg p-4 mb-4 gap-1 w-full">
            <Text className="text-base font-poppins-bold text-textSecondary">Active Filters: {chips.length}</Text>
            <View className="flex-row flex-wrap gap-2 justify-center">
                {chips.map((chip) => (
                    <View key={chip.key} className="bg-primary rounded-full px-3 py-1">
                        <Text className="text-xs font-poppins text-white">{chip.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

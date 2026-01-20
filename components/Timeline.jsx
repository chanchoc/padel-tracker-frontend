import { Text, View } from "react-native";

export function Timeline({ data, maxWeeks = 10 }) {
    if (!data || data.length === 0) {
        return (
            <View className="w-full bg-surface rounded-lg p-6 shadow-sm mb-4">
                <Text className="text-textSecondary text-center font-poppins-italic">No timeline data available</Text>
            </View>
        );
    }

    const matchesByWeek = data.reduce((acc, match) => {
        const dateStr = match.date.split("T")[0];
        const [year, month, day] = dateStr.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        const day_of_week = date.getDay();
        const daysToMonday = day_of_week === 0 ? 6 : day_of_week - 1;
        const monday = new Date(date);
        monday.setDate(monday.getDate() - daysToMonday);
        const weekKey = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(
            monday.getDate()
        ).padStart(2, "0")}`;
        if (!acc[weekKey]) {
            acc[weekKey] = {
                mondayDate: monday,
                matches: [],
            };
        }
        acc[weekKey].matches.push(match);
        return acc;
    }, {});

    const sortedWeeks = Object.entries(matchesByWeek)
        .sort(([weekA], [weekB]) => new Date(weekB) - new Date(weekA))
        .slice(0, maxWeeks);

    return (
        <View className="w-full bg-surface rounded-lg shadow-sm overflow-hidden mb-4">
            {/* Header */}
            <View className="bg-slate-900 px-4 py-3 flex-row justify-between items-center">
                <Text className="text-surface font-poppins-bold text-lg">Timeline</Text>
                <Text className="text-surface text-xs opacity-70 font-poppins">Last {maxWeeks} weeks with matches</Text>
            </View>
            {/* Content */}
            <View className="p-4">
                {sortedWeeks.map(([weekKey, { mondayDate, matches }]) => {
                    const sundayDate = new Date(mondayDate);
                    sundayDate.setDate(sundayDate.getDate() + 6);
                    const wins = matches.filter((m) => m.result === "Win").length;
                    const losses = matches.filter((m) => m.result === "Lose").length;
                    const draws = matches.filter((m) => m.result === "Draw").length;
                    const dnf = matches.filter((m) => m.result === "DNF").length;
                    const winRate = matches.length > 0 ? (wins / matches.length) * 100 : 0;
                    const lossRate = matches.length > 0 ? (losses / matches.length) * 100 : 0;
                    return (
                        <View key={weekKey} className="mb-4">
                            {/* Rango de semana */}
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-sm font-poppins-semibold text-textPrimary">
                                    {mondayDate.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}{" "}
                                    -{" "}
                                    {sundayDate.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </Text>
                                <Text className="text-xs text-textSecondary font-poppins">
                                    {matches.length} {matches.length === 1 ? "match" : "matches"}
                                </Text>
                            </View>
                            {/* Barra de progreso */}
                            <View className="flex-row items-center">
                                <View className="flex-1 h-10 bg-gray-200 rounded-lg overflow-hidden flex-row">
                                    {/* Wins */}
                                    {wins > 0 && (
                                        <View
                                            className="bg-emerald-500 h-full justify-center items-center"
                                            style={{ width: `${winRate}%` }}
                                        >
                                            <Text className="text-white text-xs font-poppins-bold">{wins}W</Text>
                                        </View>
                                    )}
                                    {/* Losses */}
                                    {losses > 0 && (
                                        <View
                                            className="bg-red-500 h-full justify-center items-center"
                                            style={{ width: `${lossRate}%` }}
                                        >
                                            <Text className="text-white text-xs font-poppins-bold">{losses}L</Text>
                                        </View>
                                    )}
                                    {/* Draws + DNF */}
                                    {(draws > 0 || dnf > 0) && (
                                        <View
                                            className="bg-blue-400 h-full justify-center items-center"
                                            style={{ width: `${((draws + dnf) / matches.length) * 100}%` }}
                                        >
                                            <Text className="text-white text-xs font-poppins-bold">{draws + dnf}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
            {/* Leyenda */}
            <View className="border-t border-gray-200 p-4 flex-row justify-around">
                <View className="items-center">
                    <View className="w-4 h-4 bg-emerald-500 rounded mb-1" />
                    <Text className="text-xs text-textSecondary font-poppins">Wins</Text>
                </View>
                <View className="items-center">
                    <View className="w-4 h-4 bg-red-500 rounded mb-1" />
                    <Text className="text-xs text-textSecondary font-poppins">Losses</Text>
                </View>
                <View className="items-center">
                    <View className="w-4 h-4 bg-blue-400 rounded mb-1" />
                    <Text className="text-xs text-textSecondary font-poppins">Other</Text>
                </View>
            </View>
        </View>
    );
}

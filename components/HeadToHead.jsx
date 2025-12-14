import { Text, View } from "react-native";

export function HeadToHead({ data }) {
    if (!data || data.length === 0) {
        return (
            <View className="w-full bg-surface rounded-lg p-6 shadow-sm mb-4">
                <Text className="text-textSecondary text-center font-poppins-italic">
                    No head-to-head data available
                </Text>
            </View>
        );
    }

    const sortedData = [...data].sort((a, b) => b.totalMatches - a.totalMatches);

    return (
        <View className="w-full bg-surface rounded-lg shadow-sm overflow-hidden mb-4">
            {/* Header */}
            <View className="bg-slate-900 px-4 py-3">
                <Text className="text-surface font-poppins-bold text-lg">Head to Head</Text>
            </View>
            {/* Table Header */}
            <View className="flex-row bg-slate-100 px-4 py-3 border-b border-gray-300">
                <Text className="flex-1 text-textPrimary font-poppins-semibold text-sm">Player</Text>
                <Text className="w-12 text-textPrimary font-poppins-semibold text-sm text-center">GP</Text>
                <Text className="w-10 text-textPrimary font-poppins-semibold text-sm text-center">W</Text>
                <Text className="w-10 text-textPrimary font-poppins-semibold text-sm text-center">L</Text>
                <Text className="w-10 text-textPrimary font-poppins-semibold text-sm text-center">DNF</Text>
                <Text className="w-14 text-textPrimary font-poppins-semibold text-sm text-right">WR%</Text>
            </View>
            {/* Table Body */}
            {sortedData.map((player, index) => (
                <View
                    key={player.playerId}
                    className={`flex-row items-center px-4 py-3 border-b border-gray-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                >
                    <Text className="flex-1 text-textPrimary font-poppins text-base" numberOfLines={2}>
                        {player.name}
                    </Text>
                    <Text className="w-12 text-textSecondary text-sm text-center font-poppins-semibold">
                        {player.totalMatches}
                    </Text>
                    <Text className="w-10 text-emerald-600 font-poppins-semibold text-sm text-center">
                        {player.wins}
                    </Text>
                    <Text className="w-10 text-red-600 font-poppins-semibold text-sm text-center">{player.losses}</Text>
                    <Text className="w-10 text-blue-600 font-poppins-semibold text-sm text-center">
                        {player.draws + player.dnf}
                    </Text>
                    <Text className="w-14 text-textPrimary font-poppins-bold text-sm text-right">
                        {player.winRate}%
                    </Text>
                </View>
            ))}
        </View>
    );
}

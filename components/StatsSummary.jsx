import { Text, View } from "react-native";

export function StatsSummary({ stats }) {
    const cards = [
        { title: "Matches", value: stats?.totalMatches, classes: "bg-blue-50 border-blue-200" },
        { title: "Wins", value: stats?.wins, classes: "bg-emerald-50 border-emerald-200" },
        { title: "Losses", value: stats?.losses, classes: "bg-red-50 border-red-200" },
        { title: "Win Rate", value: stats?.winRate, symbol: "%", classes: "bg-amber-50 border-amber-200 mr-3" },
    ];

    return (
        <View className="w-full bg-surface rounded-lg shadow-sm overflow-hidden mb-4">
            {/* Header */}
            <View className="bg-slate-900 px-4 py-3 flex-row justify-between items-center">
                <Text className="text-surface font-poppins-bold text-lg">Stats Summary</Text>
            </View>
            <View className="flex-row items-center justify-between py-4">
                {cards.map((card) => (
                    <StatsCard key={card.title} {...card} />
                ))}
            </View>
        </View>
    );
}

function StatsCard({ title, value, classes = "", symbol = "" }) {
    return (
        <View className={`flex-1 items-center border rounded-lg py-2 ml-3 shadow-sm ${classes}`}>
            <Text className="text-xl font-poppins-bold text-center tracking-tighter text-slate-900">
                {value}
                {symbol ? " " + symbol : ""}
            </Text>
            <Text className="text-sm text-slate-500 text-center tracking-tighter font-poppins">{title}</Text>
        </View>
    );
}

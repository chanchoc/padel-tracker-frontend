import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { getMatches } from "../services/matches.js";
import { AnimatedMatchCardMemo, MatchCardSkeleton } from "./MatchCard.jsx";
import { ErrorMessage } from "./ErrorMessage.jsx";
import { useMatches } from "../hooks/useMatches.js";

export function AllMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { refreshTrigger } = useMatches();

    useEffect(() => {
        setLoading(true);
        setError(null);
        getMatches()
            .then((data) => {
                setMatches(data.data);
            })
            .catch((error) => {
                console.error("Error fetching matches:", error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [refreshTrigger]);

    if (loading) {
        return (
            <View className="flex-1 bg-background px-6">
                <View className="pt-3">
                    {[0, 1, 2].map((index) => (
                        <MatchCardSkeleton key={index} index={index} />
                    ))}
                </View>
            </View>
        );
    }

    if (error) {
        return <ErrorMessage message={"Error loading your matches"} classes={"px-6 py-3"} />;
    }

    return (
        <View className="flex-1 bg-background px-6">
            {matches.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                    <View className="items-center">
                        <Text className="text-2xl text-textPrimary mb-2 text-center font-poppins-bold">
                            No matches yet
                        </Text>
                        <Text className="text-textSecondary text-center mb-2 leading-6 font-poppins">
                            Start tracking your padel matches to see your stats and performance.
                        </Text>
                        <View className="bg-primary/10 rounded-lg px-4 py-3 border border-primary">
                            <Text className="text-primary text-center font-poppins-semibold">
                                Tap the + button to create your first match
                            </Text>
                        </View>
                    </View>
                </View>
            ) : (
                <FlatList
                    data={matches}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item, index }) => <AnimatedMatchCardMemo match={item} index={index} />}
                    className="flex-1"
                    contentContainerStyle={{ paddingTop: 12, paddingBottom: 12, gap: 12 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

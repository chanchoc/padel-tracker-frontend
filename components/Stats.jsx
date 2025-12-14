import { ScrollView, View } from "react-native";
import { StatsSummary } from "./StatsSummary.jsx";
import { HeadToHead } from "./HeadToHead.jsx";
import { Timeline } from "./Timeline.jsx";
import { useState, useCallback, useRef } from "react";
import { getSummaryStats, getHeadToHeadStats, getTimeline } from "../services/stats.js";
import { useMatches } from "../hooks/useMatches.js";
import { ErrorMessage } from "./ErrorMessage.jsx";
import { useFocusEffect } from "@react-navigation/native";
import { StatsSkeleton } from "./StatsSkeleton.jsx";

export function Stats() {
    const [stats, setStats] = useState(null);
    const [headToHead, setHeadToHead] = useState(null);
    const [timeline, setTimeline] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { refreshTrigger } = useMatches();
    const lastRefreshTrigger = useRef(0);

    const loadStats = useCallback(() => {
        if (lastRefreshTrigger.current === refreshTrigger) {
            return;
        }
        setLoading(true);
        setError(null);
        lastRefreshTrigger.current = refreshTrigger;
        Promise.all([
            getSummaryStats().then((data) => setStats(data.data)),
            getHeadToHeadStats().then((data) => setHeadToHead(data.data)),
            getTimeline().then((data) => setTimeline(data.data)),
        ])
            .catch((error) => {
                console.error("Error loading stats:", error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [refreshTrigger]);

    useFocusEffect(loadStats);

    if (loading) {
        return (
            <ScrollView className="flex-1 bg-background" contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 items-center justify-start p-6">
                    <StatsSkeleton />
                </View>
            </ScrollView>
        );
    }

    if (error) {
        return <ErrorMessage message={"Error loading your stats"} classes={"my-3 px-6 py-3"} />;
    }

    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 items-center justify-start p-6">
                {/* Stats Summary Component */}
                <StatsSummary stats={stats} />
                {/* Timeline Component */}
                <Timeline data={timeline} maxWeeks={5} />
                {/* Head to head Component */}
                <HeadToHead data={headToHead} />
            </View>
        </ScrollView>
    );
}

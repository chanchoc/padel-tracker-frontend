import { Pressable, ScrollView, View } from "react-native";
import { StatsSummary } from "./StatsSummary.jsx";
import { HeadToHead } from "./HeadToHead.jsx";
import { Timeline } from "./Timeline.jsx";
import { useState, useCallback, useRef, useLayoutEffect } from "react";
import { getSummaryStats, getHeadToHeadStats, getTimeline } from "../services/stats.js";
import { getPlayers } from "../services/players.js";
import { useMatches } from "../hooks/useMatches.js";
import { ErrorMessage } from "./ErrorMessage.jsx";
import { useFocusEffect } from "@react-navigation/native";
import { StatsSkeleton } from "./StatsSkeleton.jsx";
import { useNavigation } from "expo-router";
import { FiltersIcon } from "./Icons.jsx";
import { StatsFilters } from "./StatsFilters.jsx";
import { useForm } from "react-hook-form";
import { AppliedFiltersDisplay } from "./AppliedStatsDisplay.jsx";

const EMPTY_FILTERS = {
    startDate: null,
    endDate: null,
    opponents: [],
    teammates: [],
    level: null,
    side: null,
};

const transformLevelToArray = (levelRange) => {
    if (!levelRange) return undefined;
    const rangeMap = {
        "1-3": [1, 2, 3],
        "4-6": [4, 5, 6],
        "7-9": [7, 8, 9],
    };
    return rangeMap[levelRange];
};

const buildApiFilters = (appliedFilters) => {
    const apiFilters = {};
    if (appliedFilters.startDate) apiFilters.startDate = appliedFilters.startDate;
    if (appliedFilters.endDate) apiFilters.endDate = appliedFilters.endDate;
    if (appliedFilters.side) apiFilters.side = appliedFilters.side;
    if (appliedFilters.level) apiFilters.level = transformLevelToArray(appliedFilters.level);
    if (appliedFilters.opponents?.length > 0) apiFilters.opponents = appliedFilters.opponents;
    if (appliedFilters.teammates?.length > 0) apiFilters.teammates = appliedFilters.teammates;
    return apiFilters;
};

const normalizeApiFilters = (filters) => {
    const api = buildApiFilters(filters);
    // Ordenar arrays para firmas estables
    if (api.opponents) api.opponents = [...api.opponents].sort();
    if (api.teammates) api.teammates = [...api.teammates].sort();
    return api;
};

const buildFiltersKey = (filters) => {
    const api = normalizeApiFilters(filters);
    // Ordenar claves y serializar
    return Object.entries(api)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join("|") : v}`)
        .join("&");
};

export function Stats() {
    const [stats, setStats] = useState(null);
    const [headToHead, setHeadToHead] = useState(null);
    const [timeline, setTimeline] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
    const filtersForm = useForm({ defaultValues: appliedFilters });
    const navigation = useNavigation();
    const { refreshTrigger } = useMatches();
    const lastRefreshTrigger = useRef(0);

    const fetchStats = useCallback((filters) => {
        setLoading(true);
        setError(null);
        const apiFilters = buildApiFilters(filters);
        Promise.all([
            getSummaryStats(apiFilters).then((data) => setStats(data.data)),
            getHeadToHeadStats(apiFilters).then((data) => setHeadToHead(data.data)),
            getTimeline(apiFilters).then((data) => setTimeline(data.data)),
            getPlayers().then((data) => setPlayers(orderPlayersByName(data.data))),
        ])
            .catch((error) => {
                console.error("Error loading stats:", error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const loadStats = useCallback(() => {
        if (lastRefreshTrigger.current === refreshTrigger) return;
        lastRefreshTrigger.current = refreshTrigger;
        fetchStats(appliedFilters);
    }, [refreshTrigger, appliedFilters, fetchStats]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View className="flex-row mr-4">
                    <Pressable
                        disabled={loading}
                        onPress={() => {
                            filtersForm.reset(appliedFilters);
                            setShowFilters(true);
                        }}
                        style={{
                            opacity: loading ? 0.5 : 1,
                            backgroundColor: "#FFFFFF",
                            borderRadius: 20,
                            width: 40,
                            height: 40,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        accessibilityLabel="Add filters"
                        accessibilityHint="Opens form to select filters"
                    >
                        <FiltersIcon size={24} color="#0F172A" />
                    </Pressable>
                </View>
            ),
        });
    }, [navigation, loading, appliedFilters, filtersForm]);

    useFocusEffect(loadStats);

    const orderPlayersByName = (playersList) => {
        return playersList.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    };

    const onSubmitFilters = (data) => {
        const currentKey = buildFiltersKey(appliedFilters);
        const nextKey = buildFiltersKey(data);
        if (currentKey === nextKey) {
            setShowFilters(false);
            return;
        }
        setAppliedFilters(data);
        fetchStats(data);
        setShowFilters(false);
    };

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
        <>
            <ScrollView
                className="flex-1 bg-background"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 items-center justify-start p-6">
                    {/* Applied Filters Display */}
                    <AppliedFiltersDisplay appliedFilters={appliedFilters} />
                    {/* Stats Summary Component */}
                    <StatsSummary stats={stats} />
                    {/* Timeline Component */}
                    <Timeline data={timeline} maxWeeks={5} />
                    {/* Head to head Component */}
                    <HeadToHead data={headToHead} />
                </View>
            </ScrollView>
            <StatsFilters
                visible={showFilters}
                onClose={() => {
                    filtersForm.reset(appliedFilters);
                    setShowFilters(false);
                }}
                control={filtersForm.control}
                onApply={filtersForm.handleSubmit(onSubmitFilters)}
                onClear={() => filtersForm.reset(EMPTY_FILTERS)}
                players={players}
            />
        </>
    );
}

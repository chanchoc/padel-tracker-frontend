import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { getMatches } from "../services/matches.js";
import { getPlayers } from "../services/players.js";
import { AnimatedMatchCardMemo, MatchCardSkeleton } from "./MatchCard.jsx";
import { ErrorMessage } from "./ErrorMessage.jsx";
import { useMatches } from "../hooks/useMatches.js";
import { router, useNavigation } from "expo-router";
import { useForm } from "react-hook-form";
import { FiltersIcon, PlusIcon, UserIcon } from "./Icons.jsx";
import { MatchFilters } from "./MatchFilters.jsx";
import { AppliedFiltersDisplay } from "./AppliedStatsDisplay.jsx";

const LIMIT = 10;

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

const hasActiveFilters = (appliedFilters) => {
    return (
        appliedFilters.startDate ||
        appliedFilters.endDate ||
        appliedFilters.level ||
        appliedFilters.side ||
        appliedFilters.opponents?.length > 0 ||
        appliedFilters.teammates?.length > 0
    );
};

export function AllMatches() {
    const [matches, setMatches] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
    const navigation = useNavigation();
    const filtersForm = useForm({ defaultValues: appliedFilters });
    const { refreshTrigger } = useMatches();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View className="flex-row mr-4">
                    {/* Botón filtros */}
                    <Pressable
                        disabled={loading || (matches.length === 0 && !hasActiveFilters(appliedFilters))}
                        onPress={() => {
                            filtersForm.reset(appliedFilters);
                            setShowFilters(true);
                        }}
                        style={{
                            opacity: loading || (matches.length === 0 && !hasActiveFilters(appliedFilters)) ? 0.5 : 1,
                            backgroundColor: "#FFFFFF",
                            borderRadius: 20,
                            width: 40,
                            height: 40,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                        }}
                    >
                        <FiltersIcon size={24} color="#0F172A" />
                    </Pressable>
                    {/* Botón players */}
                    <Pressable
                        className="bg-surface rounded-full h-10 w-10 items-center justify-center active:bg-gray-300"
                        style={{ marginRight: 12 }}
                        onPress={() => router.push("/players")}
                    >
                        <UserIcon size={24} color="#0F172A" />
                    </Pressable>
                    {/* Botón nuevo partido */}
                    <Pressable
                        className="bg-primary rounded-full h-10 w-10 items-center justify-center active:bg-primary/80"
                        onPress={() => router.push("/create-match")}
                    >
                        <PlusIcon size={24} color="#FFFFFF" />
                    </Pressable>
                </View>
            ),
        });
    }, [navigation, loading, appliedFilters, filtersForm, matches.length]);

    const onRefresh = () => {
        setRefreshing(true);
        loadInitialMatches(appliedFilters);
    };

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
        loadInitialMatches(data);
        setShowFilters(false);
    };

    const loadInitialMatches = useCallback((filters) => {
        setLoading(true);
        setError(null);
        const apiFilters = buildApiFilters(filters);
        Promise.all([
            getMatches({ limit: LIMIT, ...apiFilters }).then((response) => {
                const { data, hasMore, nextCursor } = response.data;
                setMatches(data);
                setHasMore(hasMore);
                setCursor(nextCursor);
            }),
            getPlayers().then((data) => setPlayers(orderPlayersByName(data.data))),
        ])
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    }, []);

    const loadMoreMatches = () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        const apiFilters = buildApiFilters(appliedFilters);
        getMatches({ limit: LIMIT, cursor, ...apiFilters })
            .then((response) => {
                const { data, hasMore: newHasMore, nextCursor } = response.data;
                setMatches((prevMatches) => [...prevMatches, ...data]);
                setHasMore(newHasMore);
                setCursor(nextCursor);
            })
            .catch((error) => {
                console.error("Error fetching more matches:", error);
            })
            .finally(() => {
                setLoadingMore(false);
            });
    };

    useEffect(() => {
        loadInitialMatches(appliedFilters);
    }, [refreshTrigger, loadInitialMatches, appliedFilters]);

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
                <>
                    {hasActiveFilters(appliedFilters) && (
                        <AppliedFiltersDisplay appliedFilters={appliedFilters} labelClass="my-5" />
                    )}
                    <View className="flex-1 items-center justify-center">
                        <View className="items-center">
                            {!hasActiveFilters(appliedFilters) ? (
                                // Sin filtros: mensaje inicial
                                <>
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
                                </>
                            ) : (
                                // Con filtros: mensaje de sin resultados
                                <>
                                    <Text className="text-2xl text-textPrimary mb-2 text-center font-poppins-bold">
                                        No matches found
                                    </Text>
                                    <Text className="text-textSecondary text-center mb-2 leading-6 font-poppins">
                                        No matches meet the active filters criteria.
                                    </Text>
                                    <View className="bg-primary/10 rounded-lg px-4 py-3 border border-primary">
                                        <Text className="text-primary text-center font-poppins-semibold">
                                            Try adjusting your filters
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </>
            ) : (
                // Con matches: mostrar lista
                <>
                    <FlatList
                        data={matches}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={({ item, index }) => <AnimatedMatchCardMemo match={item} index={index} />}
                        className="flex-1"
                        ListHeaderComponent={
                            hasActiveFilters(appliedFilters) ? (
                                <AppliedFiltersDisplay appliedFilters={appliedFilters} labelClass="mt-5 mb-0" />
                            ) : null
                        }
                        contentContainerStyle={{
                            paddingTop: hasActiveFilters(appliedFilters) ? 0 : 12,
                            paddingBottom: 12,
                            gap: 12,
                        }}
                        showsVerticalScrollIndicator={false}
                        onEndReached={loadMoreMatches}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            loadingMore ? (
                                <View className="py-4">
                                    <ActivityIndicator size="large" color="#1E40AF" />
                                </View>
                            ) : null
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={["#1E40AF"]}
                                tintColor="#1E40AF"
                            />
                        }
                    />
                </>
            )}
            {/* Modal siempre disponible fuera del ternario */}
            <MatchFilters
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
        </View>
    );
}

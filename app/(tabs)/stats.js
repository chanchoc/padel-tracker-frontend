import { useAuth } from "../../hooks/useAuth.js";
import { Redirect } from "expo-router";
import { Stats } from "../../components/Stats.jsx";
import { AuthLoading } from "../../components/AuthLoading.jsx";

export default function StatsTab() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <AuthLoading />;
    }

    if (!isAuthenticated) {
        return <Redirect href="/auth/login" />;
    }

    return <Stats />;
}

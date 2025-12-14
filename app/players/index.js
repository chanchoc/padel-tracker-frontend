import { Redirect } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { AuthLoading } from "../../components/AuthLoading.jsx";
import { PlayersManager } from "../../components/PlayersManager.jsx";

export default function PlayersScreen() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <AuthLoading />;
    }
    if (!isAuthenticated) {
        return <Redirect href="/auth/login" />;
    }
    return <PlayersManager />;
}

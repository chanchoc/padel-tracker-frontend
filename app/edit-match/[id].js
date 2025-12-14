import { Redirect, useLocalSearchParams } from "expo-router";
import { EditMatch } from "../../components/EditMatch.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { AuthLoading } from "../../components/AuthLoading.jsx";

export default function CreateMatchScreen() {
    const { isAuthenticated, isLoading } = useAuth();
    const { id } = useLocalSearchParams();

    if (isLoading) {
        return <AuthLoading />;
    }

    if (!isAuthenticated) {
        return <Redirect href="/auth/login" />;
    }

    return <EditMatch matchId={id} />;
}

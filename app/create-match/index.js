import { Redirect } from "expo-router";
import { CreateMatch } from "../../components/CreateMatch.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { AuthLoading } from "../../components/AuthLoading.jsx";

export default function CreateMatchScreen() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <AuthLoading />;
    }

    if (!isAuthenticated) {
        return <Redirect href="/auth/login" />;
    }

    return <CreateMatch />;
}

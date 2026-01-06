import { AllMatches } from "../../components/AllMatches.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { AuthLoading } from "../../components/AuthLoading.jsx";
import { Redirect } from "expo-router";

export default function HomeTab() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <AuthLoading />;
    }

    if (!isAuthenticated) {
        return <Redirect href="/auth/login" />;
    }

    return <AllMatches />;
}

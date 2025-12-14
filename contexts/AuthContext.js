/* global setTimeout */
import { createContext, useState, useEffect } from "react";
import { testAuthentication } from "../services/httpClient.js";
import { clearTokens } from "../services/tokenStorage.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const result = await testAuthentication();
            if (result.success) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                await clearTokens();
            }
        } catch (error) {
            console.error("Error checking authentication status:", error);
            setIsAuthenticated(false);
            await clearTokens();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async () => {
        setIsAuthenticated(true);
    };

    const logout = async (withDelay = false, delay = 1500) => {
        try {
            await clearTokens();
            if (withDelay) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Error during logout:", error);
            setIsAuthenticated(false);
        }
    };

    const value = {
        isAuthenticated,
        isLoading,
        checkAuthStatus,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

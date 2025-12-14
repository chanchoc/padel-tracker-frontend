import { createContext, useCallback, useState } from "react";

const MatchesContext = createContext();

export const MatchesProvider = ({ children }) => {
    const [refreshTrigger, setRefreshTrigger] = useState(1);

    const refreshMatches = useCallback(() => {
        setRefreshTrigger((prev) => prev + 1);
    }, []);

    const value = {
        refreshTrigger,
        refreshMatches,
    };

    return <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>;
};

export { MatchesContext };

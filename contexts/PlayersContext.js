import { createContext, useCallback, useState } from "react";

const PlayersContext = createContext();

export const PlayersProvider = ({ children }) => {
    const [refreshTrigger, setRefreshTrigger] = useState(1);

    const refreshPlayers = useCallback(() => {
        setRefreshTrigger((prev) => prev + 1);
    }, []);

    const value = {
        refreshTrigger,
        refreshPlayers,
    };

    return <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>;
};

export { PlayersContext };

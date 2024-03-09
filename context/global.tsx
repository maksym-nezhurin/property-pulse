'use client'
import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext({ setUnreadCount: (state: number) => {}, unreadCount: 0 });

// Create a provider

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [unreadCount, setUnreadCount] = useState(0);

    return (
        <GlobalContext.Provider value={{
            unreadCount,
            setUnreadCount
        }}>{children}</GlobalContext.Provider>
    );
}

export function useGlobalContext() {
    return useContext(GlobalContext)
}
// context/FeedContext.tsx
"use client";
import React, { createContext, useContext, useState } from 'react';

type FeedContextType = {
    refreshFeed: () => void;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshFeed = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <FeedContext.Provider value={{ refreshFeed }}>
            {children}
        </FeedContext.Provider>
    );
};

export const useFeed = () => {
    const context = useContext(FeedContext);
    if (!context) {
        throw new Error('useFeed must be used within a FeedProvider');
    }
    return context;
};
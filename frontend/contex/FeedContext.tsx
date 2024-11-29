// context/FeedContext.tsx
"use client";
import React, { createContext, useContext, useState } from 'react';
import {PostStorage} from "@/app/types/PostStorage";

type FeedContextType = {
    refreshFeed: () => void;
    addPost: (post: PostStorage) => void;
    addAllPosts: (posts: PostStorage[]) => void;
    posts: { [key: number]: PostStorage };
    filters: { [key: number]: string };
    addAllFilters: (filters: { [key: number]: string }) => void;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [posts, setPosts] = useState<{ [key: number]: PostStorage }>({});
    const [filters, setFilters] = useState<{ [key: number]: string }>({});

    const refreshFeed = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    const addPost = (post: PostStorage) => {
        console.log("SE ESTÁ AÑADIENDO UN POST", post);
        setPosts(prevPosts => {
            // Check if the post already exists
            if (!prevPosts[post.post.id]) {
                return { ...prevPosts, [post.post.id]: post };
            } else {
                console.log("El post con id", post.post.id, "ya existe.");
                return prevPosts;
            }
        });
    };

    const addAllPosts = (posts: PostStorage[]) => {
        console.log("SE ESTÁN AÑADIENDO VARIOS POSTS", posts);
        setPosts(prevPosts => {
            const newPosts: { [key: number]: PostStorage } = {};
            posts.forEach(post => {
                newPosts[post.post.id] = post;
            });
            return { ...prevPosts, ...newPosts };
        });
    }

    const addAllFilters = (filters: { [key: number]: string }) => {
        setFilters(filters);
    }

    return (
        <FeedContext.Provider value={{ refreshFeed, addPost, addAllPosts, posts, filters, addAllFilters }}>
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
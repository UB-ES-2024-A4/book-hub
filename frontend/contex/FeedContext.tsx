// context/FeedContext.tsx
"use client";
import React, { createContext, useContext, useState } from 'react';
import {Post} from "@/app/types/Post";
import {Book} from "@/app/types/Book";
import {User} from "@/app/types/User";

type FeedContextType = {
    refreshFeed: () => void;
    addPost: (post: Post) => void;
    posts: Post[];
    addBook: (book: Book) => void;
    books: Book[];
    addUser: (user: User) => void;
    users: User[];
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const refreshFeed = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    const addPost = (post: Post) => {
        setPosts(prevPosts => [...prevPosts, post]);
    };

    const addBook = (book: Book) => {
        setBooks(prevBooks => [...prevBooks, book]);
    };

    const addUser = (user: User) => {
        setUsers(prevUsers => [...prevUsers, user]);
    }

    return (
        <FeedContext.Provider value={{ refreshFeed, posts: [], addPost,
                                    books: [], addBook, users: [], addUser }}>
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
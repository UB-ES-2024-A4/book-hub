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
    addBookToMap: (id: number, book: Book) => void;
    booksMap: { [key: number]: Book };
    addUserToMap: (id: number, user: User) => void;
    usersMap: { [key: number]: User };
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [usersMap, setUsersMap] = useState<{ [key: number]: User }>({});
    const [booksMap, setBooksMap] = useState<{ [key: number]: Book }>({});

    const refreshFeed = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    const addPost = (post: Post) => {

        console.log("SE ESTÁ AÑADIENDO UN POST", post);
        posts.forEach((p) => {
            if (p.id === post.id) {
                console.log("EL POST YA EXISTE");
                return;
            }
        });
        setPosts(prevPosts => [...prevPosts, post]);
    }

    const addBookToMap = (id: number, book: Book) => {
        console.log("SE ESTÁ AÑADIENDO UN LIBRO", book);
        setBooksMap(prevBooksMap => ({ ...prevBooksMap, [id]: book }));
    }

    const addUserToMap = (id: number, user: User) => {
        console.log("SE ESTÁ AÑADIENDO UN USUARIO", user);
        setUsersMap(prevUserData => ({ ...prevUserData, [id]: user }));
    }


    return (
        <FeedContext.Provider value={{ refreshFeed, posts, addPost, booksMap, addBookToMap, usersMap, addUserToMap }}>
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
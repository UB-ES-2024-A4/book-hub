// context/FeedContext.tsx
"use client";
import React, { createContext, useContext, useState } from 'react';
import {PostStorage} from "@/app/types/PostStorage";
import {CommentUnic} from "@/app/types/PostStorage";

type FeedContextType = {
    refreshFeed: () => void;
    addPost: (post: PostStorage) => void;
    addAllPosts: (posts: PostStorage[]) => void;
    posts: { [key: number]: PostStorage };
    filters: { [key: number]: string };
    addAllFilters: (filters: { [key: number]: string }) => void;
    // A map for comments by post id
    comments: { [key: number]: CommentUnic[] };
    addCommentByUser: (comment: CommentUnic, postId: number) => void;
    addComments: (comments: CommentUnic[], postId: number) => void;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [posts, setPosts] = useState<{ [key: number]: PostStorage }>({});
    const [filters, setFilters] = useState<{ [key: number]: string }>({});
    const [comments, setComments] = useState<{ [key: number]: CommentUnic[] }>({});

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
        //Vacíar los posts actuales
        setPosts({});

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

    const addCommentByUser = (comment: CommentUnic, postId: number) => {
        console.log("SE ESTÁ AÑADIENDO UN COMENTARIO By USER", comment);
        setComments(prevComments => {
            if (!prevComments[postId]) {
                return { ...prevComments, [postId]: [comment] };
            } else {
                return { ...prevComments, [postId]: [...prevComments[postId], comment] };
            }
        });
    }

    const addComments = (comments: CommentUnic[], postId: number) => {
        console.log("SE ESTÁN AÑADIENDO VARIOS COMENTARIOS", comments);
        setComments(prevComments => {
            return { ...prevComments, [postId]: comments };
        });
    }
    return (
        <FeedContext.Provider value={{ refreshFeed, addPost, addAllPosts, posts, filters, addAllFilters,
            comments, addCommentByUser, addComments }}>
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
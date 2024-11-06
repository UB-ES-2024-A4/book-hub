"use client";
// Importing necessary functions from Next.js and other libraries
import React from "react";
import { useEffect, useState } from "react";
import SearchHome from "@/app/home/components/SearchHome";
import ScrollAreaHome from "@/app/home/components/ScrollAreaHome";
import { loadPosts } from "@/app/actions";
import { Post } from "@/app/types/Post";
import FetchError from "@/components/FetchError";

export default function MainContent (){

    const [posts, setPosts] = useState<Post[] | null>(null);
    const [fetchError, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const loadedPosts = await loadPosts();
                if (!loadedPosts) {
                    setError("Failed to fetch posts");
                    return;
                }
                setPosts(loadedPosts);
            } catch (error) {
                console.error("Failed to fetch posts", error);
                setError("Failed to fetch posts");
            }
        }

        fetchPosts();
    }, []);


    return (
        fetchError ? (
            <div className="min-h-screen flex items-center justify-center">
            <FetchError />

            </div>
        ) : (
            <div className="flex flex-1 overflow-hidden pt-10">
                {/* Sidebar (Search) */}
                <SearchHome/>
                {/* Feed Section */}
                <ScrollAreaHome posts={posts}/>
            </div>
        )
    )
}
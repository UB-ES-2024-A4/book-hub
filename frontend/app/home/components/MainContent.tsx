"use client";
// Importing necessary functions from Next.js and other libraries
import React, {Suspense} from "react";
import { useEffect, useState } from "react";
import SearchHome from "@/app/home/components/SearchHome";
import ScrollAreaHome from "@/app/home/components/ScrollAreaHome";
import { loadPosts } from "@/app/actions";
import { Post } from "@/app/types/Post";
import FetchError from "@/components/FetchError";
import {useFeed} from "@/contex/FeedContext";
import {Filter} from "@/app/types/Filter";
import {toast} from "nextjs-toast-notify";
import { User } from "@/app/types/User";
import LoadingSpinner from "@/components/Loading";

type Props = {
    userData: User;
}

export default function MainContent ({ userData }: Props){

    // Refresh feed Context to update the feed
    const { addAllPosts, posts:PostContexApp } = useFeed();
    // Loading state, while fetching posts
    const [loading, setLoading] = useState(true);

    const [fetchError, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPosts() {

            try {
                const result = await loadPosts();

                if (result.status !== 200) {
                    setError(result.message || "An unknown error occurred");
                    // Stop the loading state
                    setLoading(false);
                    return;
                }

                const loadedPosts = result.data;
                if (! loadedPosts ) return;

                // Sort the posts by date
                loadedPosts.sort((a, b) => new Date(b.post.created_at).getTime() - new Date(a.post.created_at).getTime());
                addAllPosts(loadedPosts);

            } catch (error:any) {
                setError(error.message);
            }
            // Stop the loading state
            setLoading(false);
        }
        fetchPosts();
    }, []);


    // Mostrar el estado de carga o error
    if (loading) return <LoadingSpinner />;

    return (
        fetchError ? (
            <div className="min-h-screen flex items-center justify-center">
                <FetchError errorDetail={fetchError} />
            </div>
        ) : (
            <div className="flex flex-1 flex-col md:flex-row overflow-hidden pt-10 md:pt-0">
                {/* Sidebar (Search) */}
                { /*<SearchHome/> */}
                {/* Feed Section */}

                <ScrollAreaHome userData={userData}/>
            </div>
        )
    )
}
"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/app/types/User";
import {useFeed} from "@/contex/FeedContext";
import { loadPosts } from "@/app/actions";
import FetchError from "@/components/FetchError";
import ScrollAreaExplorer from "@/app/explorer/components/ScrollAreaExplorer";
import LoadingSpinner from "@/components/Loading";

type Props = {
    userData: User | null;
}

export default function MainContent({ userData }: Props){

    // Refresh feed Context to update the feed
    const { addAllPosts, posts:PostContexApp } = useFeed();
    // Loading state, while fetching posts
    const [loading, setLoading] = useState(true);

    const [fetchError, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const result = await loadPosts(undefined, 0, 60, 'explorer');

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
                console.log("POSTS CARGADOS ", loadedPosts);

            } catch (error:any) {
                console.error("Failed to fetch POST", error);
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
            <div className="flex-1 flex-col md:flex-row overflow-x-auto pt-4">
                <ScrollAreaExplorer userData={userData}/>
            </div>
        )
    )
}
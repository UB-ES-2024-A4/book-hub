"use client";
// Importing necessary functions from Next.js and other libraries
import React, {Suspense} from "react";
import { useEffect, useState } from "react";
import SearchHome from "@/app/home/components/SearchHome";
import ScrollAreaHome from "@/app/home/components/ScrollAreaHome";
import {loadFilters, loadPosts} from "@/app/actions";
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

    const [fetchError, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPosts() {

            // Si en el contexto ya hay posts, no se vuelve a cargar
            console.log("Use EFFECT MAIN BEFORE");
            // Si ya existe posts en el contexto, no se vuelve a cargar
            if( PostContexApp && Object.keys(PostContexApp).length > 0) return;
            console.log("POSTS CONTEXT IN EFFECt", PostContexApp);

            try {
                const result = await loadPosts();

                if (result.status !== 200) {
                    setError("Failed to fetch posts");
                    return;
                }
                /*const postStorage: PostStorage = {
                user: post_info.user,
                post: post_info.post,
                book: post_info.book,
                filters: post_info.filters,
                likes_set: post_info.likes_set,
                n_comments: post_info.n_comments,
                comments: post_info.comments
            }*/

                const loadedPosts = result.data;
                console.log("POSTS CARGADOS ", loadedPosts);
                if (! loadedPosts ) return;

                // Sort the posts by date
                loadedPosts.sort((a, b) => new Date(b.post.created_at).getTime() - new Date(a.post.created_at).getTime());
                addAllPosts(loadedPosts);

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
            <div className="flex flex-1 flex-col md:flex-row overflow-hidden pt-10">
                {/* Sidebar (Search) */}
                { /*<SearchHome/> */}
                {/* Feed Section */}

                <ScrollAreaHome userData={userData}/>
            </div>
        )
    )
}
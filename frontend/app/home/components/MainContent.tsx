"use client";
// Importing necessary functions from Next.js and other libraries
import React from "react";
import { useEffect, useState } from "react";
import SearchHome from "@/app/home/components/SearchHome";
import ScrollAreaHome from "@/app/home/components/ScrollAreaHome";
import {loadFilters, loadPosts} from "@/app/actions";
import { Post } from "@/app/types/Post";
import FetchError from "@/components/FetchError";
import {useFeed} from "@/contex/FeedContext";
import {Filter} from "@/app/types/Filter";
import {toast} from "nextjs-toast-notify";

export default function MainContent (){

    // Refresh feed Context to update the feed
    const { refreshFeed, addPost } = useFeed();

    const [posts, setPosts] = useState<Post[] | null>(null);
    //const [filters, setFilters] = useState<Filter[] | null>(null);
    const [fetchError, setError] = useState<string | null>(null);

    useEffect(() => {

       console.log("SE EJECUTA LOAD POSTES 1");
        async function fetchPosts() {
            try {
                const result = await loadPosts();
                if (result.status !== 200) {
                    setError("Failed to fetch posts");
                    return;
                }

                const loadedPosts = result.post;
                const loadedFilters = result.filters;
                console.log("POSTS CARGADOS ", loadedPosts);
                if(!loadedPosts || !loadedFilters) return;

                console.log("FILTERS", loadedFilters);
                // Set the filters to the respective posts
                loadedPosts.forEach((post, index) => {
                    post.filter_ids = loadedFilters[index];
                });

                // Sort the posts by date
                loadedPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
               // setPosts(loadedPosts);

                loadedPosts.forEach((post) => {
                    addPost(post);
                });

                //setPosts(loadedPosts);
            } catch (error) {
                console.error("Failed to fetch posts", error);
                setError("Failed to fetch posts");
            }
        }
        fetchPosts();
    }, [posts]);

  /*  useEffect(() => {
        // Load filters if they are not loaded then Fetch Error
        async function fetchFilters() {
            const result = await loadFilters();

            console.log("Filters IN THE HEADER", result.data);

            if (result.status !== 200) {
                toast.error("¡ Could not connect to the server !", {
                    duration: 4000,
                    progress: true,
                    position: "top-left",
                    transition: "swingInverted",
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
                    sonido: true,
                  });
                return;
            }else {
                setFilters(result.data);
            }
        }
        fetchFilters();
    }, []);*/

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
                <ScrollAreaHome /*posts={posts}*//>
            </div>
        )
    )
}
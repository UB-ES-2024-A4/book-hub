"use client";
// Importing necessary functions from Next.js and other libraries
import React from "react";
import { useEffect, useState } from "react";
import SearchHome from "@/app/home/components/SearchHome";
import ScrollAreaHome from "@/app/home/components/ScrollAreaHome";
import { loadPosts } from "@/app/actions";
import { Post } from "@/app/types/Post";

export default function MainContent (){

    const [posts, setPosts] = useState<Post[] | null>(null);

    useEffect(() => {
        async function fetchPosts() {
          const loadedPosts = await loadPosts();
          setPosts(loadedPosts);
        }
        fetchPosts();
    }, []);

    if(!posts) {
        return <div>Loading...</div>
    }

    return (

        <div className="flex flex-1 overflow-hidden pt-10">
            {/* Sidebar (Search) */}
            <SearchHome/>
            {/* Feed Section */}
            <ScrollAreaHome posts={posts}/>
        </div>
    )
}
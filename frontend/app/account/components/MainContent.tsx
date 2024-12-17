"use client";
import ProfileHeader from "@/app/account/components/ProfileHeader";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";
import {useState, useEffect} from "react";
import {User} from "@/app/types/User";
import Tabs from "@/app/account/components/Tabs";
import {loadUserPostsAndLiked} from "@/app/actions";
import React from "react";
import { loadPosts } from "@/app/actions";

type Props = {
    userData: User;
}

import {useFeed} from "@/contex/FeedContext";
import { PostStorage } from "@/app/types/PostStorage";

export default function MainContent({userData}: Props) {
    const { addAllPosts, posts } = useFeed();
    // Fetch user data
    const [user, setUser] = useState(userData);
    const [postUser, setPostUser] = useState<PostStorage[] | null>(null);
    const [postLiked, setPostLiked] = useState<PostStorage[] | null>(null);
    const [fetchError, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPosts() {

            try {
                if(posts[0]) return;
                const result = await loadPosts();

                if (result.status !== 200) {
                    setError(result.message || "An unknown error occurred");
                }

                const loadedPosts = result.data;
                if (! loadedPosts ) return;

                // Sort the posts by date
                loadedPosts.sort((a, b) => new Date(b.post.created_at).getTime() - new Date(a.post.created_at).getTime());
                addAllPosts(loadedPosts);
                console.log("POSTS CARGADOS ", loadedPosts);

            } catch (error:any) {
                setError(error.message);
            }
        }
        fetchPosts();
        const fetchData = async () => {
            // Load user Posts and Liked Posts
            const response = await loadUserPostsAndLiked(userData.id);
            if (response.status !== 200) {
                console.error("Failed to fetch user data", response);
                setError(response.message || "Failed to fetch user data.");
            }else{
                console.log("RESPONSE ", response);
                setPostUser(response.data?.postUser);
                setPostLiked(response.data?.postLiked);
            }
        };

        fetchData();
    }, []);



    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="mx-2">
                {fetchError ? (
                    <FetchInformationError error={fetchError} />
                ) : (
                    user && <ProfileHeader userData={user} setUser={setUser} />
                )}
            </div>
            <div className="pt-4">
                {user && <Tabs postsUser={postUser} postsLiked={postLiked} />}
            </div>
        </div>
    )
}
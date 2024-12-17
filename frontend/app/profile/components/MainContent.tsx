"use client";
import ProfileHeader from "@/app/profile/components/ProfileHeader";
import {useState} from "react";
import {User} from "@/app/types/User";
import {useSearchParams} from "next/navigation";
import { useEffect } from "react";
import { fetchUserData, getPostList, loadPosts } from "@/app/actions";
import FetchError from "@/components/FetchError";
import Tabs from "./Tabs";
import { PostStorage } from "@/app/types/PostStorage";
import { useFeed } from "@/contex/FeedContext";

type Props = {
    userData: User | null;
}

export default  function MainContent({userData}: Props) {
    // Fetch user data
    const [fetchError, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const searchParams = useSearchParams();
    const userId = Number(searchParams.get("userId"));
    const [userPosts, setPosts] = useState<PostStorage[]>();
    const { addAllPosts, posts } = useFeed();

    useEffect(() => {
        async function fetchAllPosts() {

            try {
                if(posts[0]) return;
                const result = await loadPosts(undefined, 0, 60, 'explorer');

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
        fetchAllPosts();
        fetchAndSetUser(userId);
        fetchPosts(userId);
    },[]);

    const fetchAndSetUser = async (id: number) => {
        try {
            const result = await fetchUserData(id, userData?.id);
            if (result?.status === 200) {
                setUser(result.data);
            } else {
                setError(result?.message || "Failed to fetch user data.");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setError("An unexpected error occurred.");
        }
    };

    const fetchPosts = async (id: number) => {
        try {
            const result = await getPostList(id);
            if (result?.status === 200) {
                setPosts(result.data);
            } else {
                setError(result?.message || "Failed to fetch user posts");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setError("An unexpected error occurred.");
        }
    };

    return (
        fetchError ? (
            <div className="min-h-screen flex items-center justify-center">
                <FetchError errorDetail={fetchError} />
            </div>
        ) : (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="mx-2">
                    {user && <ProfileHeader userData={userData} userProfile={user}/>}
                </div>
                <div className="pt-4">
                    {user && posts && <Tabs postsUser={userPosts}/>}
                </div>
            </div>
        )
    )
}
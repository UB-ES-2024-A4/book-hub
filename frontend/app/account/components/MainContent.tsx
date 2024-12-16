"use client";
import ProfileHeader from "@/app/account/components/ProfileHeader";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";
import {useState} from "react";
import {User} from "@/app/types/User";
import Tabs from "@/app/account/components/Tabs";
import {loadUserPostsAndLiked} from "@/app/actions";

type Props = {
    userData: User;
}

import {useEffect} from "react";

export default function MainContent({userData}: Props) {
    // Fetch user data
    const [user, setUser] = useState(userData);
    const [postUser, setPostUser] = useState(null);
    const [postLiked, setPostLiked] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // Load user Posts and Liked Posts
            const response = await loadUserPostsAndLiked();
            setPostUser(response.data?.postUser);
            setPostLiked(response.data?.postLiked);
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="mx-2">
                {user && <ProfileHeader userData={user} setUser={setUser}/>}
            </div>
            <div className="pt-4">
                {user && <Tabs postsUser={postUser} postsLiked={postLiked}/>}
            </div>
        </div>
    )
}
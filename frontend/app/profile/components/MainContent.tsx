"use client";
import ProfileHeader from "@/app/profile/components/ProfileHeader";
import {useState} from "react";
import {User} from "@/app/types/User";
import {useSearchParams} from "next/navigation";
import { useEffect } from "react";
import { fetchUserData } from "@/app/actions";
import FetchError from "@/components/FetchError";

type Props = {
    userData: User | null;
}

export default  function MainContent({userData}: Props) {
    // Fetch user data
    const [fetchError, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const searchParams = useSearchParams();
    const userId = Number(searchParams.get("userId"));

    useEffect(() => {
        if (userId) {
            fetchAndSetUser(userId);
        }
    }, [userId]);

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
                {/* <div className="pt-4">
                            {user && <Tabs userData={user}  setUser={setUser}/>}
                        </div> */}
            </div>
        )
    )
}
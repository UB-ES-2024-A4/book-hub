"use client";
import ProfileHeader from "@/app/profile/components/ProfileHeader";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";
import {useState} from "react";
import {User} from "@/app/types/User";
import {redirect, useSearchParams} from "next/navigation";
import { useEffect } from "react";
import { fetchUserData } from "@/app/actions";
import FetchError from "@/components/FetchError";

type Props = {
    userData: User | null;
}

export default  function MainContent({userData}: Props) {
    // Fetch user data
    //const [user, setUser] = useState(userData);
    const [fetchError, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(userData);
    const searchParams = useSearchParams();
    const userId = Number(searchParams.get("userId"));

    useEffect(() => {
        if (userId) {
            fetchAndSetUser(userId);
        }
    }, [userId]);

    const fetchAndSetUser = async (id: number) => {
        try {
            const result = await fetchUserData(id); // Call the imported function
            if (result?.status === 200) {
                setUser(result.data); // Update the state with user data
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
                    {userData && <ProfileHeader userData={userData} userProfile={user}/>}
                </div>
                {/* <div className="pt-4">
                            {user && <Tabs userData={user}  setUser={setUser}/>}
                        </div> */}
            </div>
        )
    )
}
"use server";

import { cookies } from 'next/headers';
import Header from "@/components/Header";
import ProfileHeader from "@/app/account/components/ProfileHeader";
import Tabs from "./components/Tabs";
import { User } from "@/app/types/User";
import { redirect } from "next/navigation";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";

const AccountPage = async () => {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        // Redirect to sign-in if no access token is found
        redirect('/auth/sign-in');
        return null;
    }

    // Fetch user data
    let user: User | null = null;

    try {
        const response = await fetch("http://127.0.0.1:8000/users/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/json"
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user data.");
        }

        const userData = await response.json();

        // Create user object if user data is successfully fetched
        user = {
            id: userData.id,
            firstName: `${userData.first_name}`,
            lastName: `${userData.last_name}`,
            username: userData.username,
            email: userData.email,
            bio: userData.biography ?? "Add your bio!",
            profilePicture: "/vini.jpg",
            coverPhoto: "/book.jpg",
        };

    } catch (err) {
        console.error(err);
        return (
            <FetchInformationError error={"Failed to load user information."} />
        )
    }

    // Return page content with user data
    return (
        <div className="min-h-screen bg-gray-100 bg-gradient-to-br from-blue-950 to-blue-200">
            <Header />
            <main className="container mx-auto pt-16">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="mx-2">
                        {user && <ProfileHeader userData={user} />}
                    </div>
                    {/* <div className="pt-4">
                        {user && <Tabs userData={user} />}
                    </div> */}
                </div>
            </main>
        </div>
    );
};

export default AccountPage;

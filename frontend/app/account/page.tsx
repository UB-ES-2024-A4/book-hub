"use server";

import { cookies } from 'next/headers';
import Header from "@/components/Header";
import ProfileHeader from "@/app/account/components/ProfileHeader";
import Tabs from "./components/Tabs";
import { User } from "@/app/types/User";
import { redirect } from "next/navigation";
import {loadUser} from "@/app/actions";

const AccountPage = async () => {

    // Fetch user data
    const user: User | null =  await loadUser();

    // Handle error state
    if (!user) {
        return <div>Error loading user data</div>;
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

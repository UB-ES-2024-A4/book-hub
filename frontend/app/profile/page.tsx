"use server";

import Header from "@/components/Header";
import MainContent from "@/app/profile/components/MainContent";
import {User} from "@/app/types/User";
import {getSession, getAccessToken} from "@/app/lib/authentication";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";
import {redirect} from "next/navigation";

const  ProfilePage = async () => {

    const user : User | null = await getSession();

    const accessToken: string | null = await getAccessToken();

    // Return page content with user data
    return (
        <div className="min-h-screen bg-gradient-to-br bg-[#051B32] pl-0 md:pl-60">
            <Header accessToken={accessToken} user_id={user?.id}/>
            <main className="container mx-auto pt-16">
                <MainContent userData={user} />
            </main>
        </div>
    );
};

export default ProfilePage;
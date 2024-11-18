"use server";

import Header from "@/components/Header";
import MainContent from "@/app/account/components/MainContent";
import {User} from "@/app/types/User";
import {getSession, getAccessToken} from "@/app/lib/authentication";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";
import {redirect} from "next/navigation";

const  AccountPage = async () => {

    if(! await getAccessToken())
        redirect("/auth/sign-in");

    const user : User | null = await getSession();

    const accessToken: string | null = await getAccessToken();

    // Handle error state
    if (!user || !accessToken)
        return (<FetchInformationError error={"Failed to load user information."}/>);

    // Return page content with user data
    return (
        <div className="min-h-screen bg-gray-100 bg-gradient-to-br from-blue-950 to-blue-200">
            <Header accessToken={accessToken}/>
            <main className="container mx-auto pt-16">
                <MainContent  userData={user} ></MainContent>
            </main>
        </div>
    );
};

export default AccountPage;

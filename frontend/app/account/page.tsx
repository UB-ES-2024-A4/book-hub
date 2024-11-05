"use server";

import Header from "@/components/Header";
import MainContent from "@/app/account/components/MainContent";
import {User} from "@/app/types/User";
import {getSession} from "@/app/lib/authentication";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";

const  AccountPage = async () => {

    const user : User | null = await getSession();

    // Handle error state
    if (!user)
        return (<FetchInformationError error={"Failed to load user information."}/>);

    // Return page content with user data
    return (
        <div className="min-h-screen bg-gray-100 bg-gradient-to-br from-blue-950 to-blue-200">
            <Header />
            <main className="container mx-auto pt-16">
                <MainContent  userData={user} ></MainContent>
            </main>
        </div>
    );
};

export default AccountPage;

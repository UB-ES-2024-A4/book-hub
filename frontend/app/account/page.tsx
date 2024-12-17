"use server";

import Header from "@/components/Header";
import MainContent from "@/app/account/components/MainContent";
import {User} from "@/app/types/User";
import {getSession, getAccessToken} from "@/app/lib/authentication";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";
import {redirect} from "next/navigation";

const  AccountPage = async () => {

    if(! await getAccessToken())
        redirect("/sign-in");

    const user : User | null = await getSession();

    const accessToken: string | null = await getAccessToken();

    // Handle error state
    if (!user || !accessToken)
        return (<FetchInformationError error={"Failed to load user information."}/>);

    // Return page content with user data
    return (
        <div className="min-h-screen bg-gradient-to-br bg-[#051B32] pl-0 md:pl-60">
            <div className={`fixed left-0 top-0 z-[999]`}>
                <Header accessToken={accessToken} user_id={user.id}/>
            </div>
            <main className="container mx-auto pt-8 px-4 md:px-16">
                <MainContent userData={user}></MainContent>
            </main>
        </div>
    );
};

export default AccountPage;

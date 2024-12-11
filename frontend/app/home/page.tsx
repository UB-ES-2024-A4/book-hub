import Header from "@/components/Header";
import MainContent from "@/app/home/components/MainContent";
import { getAccessToken, getSession } from "../lib/authentication";
import { redirect } from "next/navigation";
import { User } from "../types/User";
import FetchInformationError from "../account/components/Errors/FetchInformationError";
import UserNoLogged from "@/components/auth/UserNoLogged";
import React from "react";

export default async function Home() {
    const accessToken: string | null = await getAccessToken();

    if(! accessToken ) {
        console.log("NO ACCESS")
        redirect("/explorer");
    }
    const user : User | null = await getSession();

    // Handle error state
    if (!user)
        return (<FetchInformationError error={"Failed to load user information."}/>);

    return (
        <div className="min-h-screen bg-gradient-to-br bg-[#051B32] flex flex-col pl-0 md:pl-44 lg:pl-52">
            <div className={`fixed left-0 top-0 z-[80]`}>
                <Header accessToken={accessToken} user_id={user?.id}/>
            </div>
            <MainContent userData={user}/>
        </div>
    );
}
import Header from "@/components/Header";
import {getAccessToken, getSession} from "@/app/lib/authentication";
import {User} from "@/app/types/User";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";
import UserNoLogged from "@/components/auth/UserNoLogged";
import React from "react";

export default async function Explorer() {

    const accessToken: string | null = await getAccessToken();
    const user : User | null = await getSession();

    return (
        <div className="min-h-screen bg-[#051B32] pl-0 md:pl-36 lg:pl-80">
            <Header accessToken={accessToken} user_id={user?.id}/>

            <div className="flex flex-col">
                {! accessToken && ( <UserNoLogged /> )}
                <h1 className="text-4xl font-bold text-center p-20">Explorer</h1>
            </div>
        </div>
    );
}
import Header from "@/components/Header";
import {getAccessToken, getSession} from "@/app/lib/authentication";
import {User} from "@/app/types/User";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";
import UserNoLogged from "@/components/auth/UserNoLogged";
import React from "react";
import MainContent from "@/app/explorer/components/MainContent";

export default async function Explorer() {

    const accessToken: string | null = await getAccessToken();
    const user : User | null = await getSession();

    return (
        <div className="min-h-screen bg-gradient-to-br bg-[#051B32] flex flex-col pl-0 md:pl-44 lg:pl-52">
            <div className={`fixed left-0 top-0 z-[9998]`}>
                <Header accessToken={accessToken} user_id={user?.id}/>
            </div>
            {!accessToken && (<UserNoLogged/>)}
            <MainContent userData={user}/>
        </div>
    );
}
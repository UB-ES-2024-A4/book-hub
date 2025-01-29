import Header from "@/components/Header";
import MainContent from "@/app/home/components/MainContent";
import { getAccessToken, getSession } from "../lib/authentication";
import { redirect } from "next/navigation";
import { User } from "../types/User";
import FetchInformationError from "../account/components/Errors/FetchInformationError";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function Home() {
    const accessToken: string | null = await getAccessToken();

    if(! accessToken ) {
        console.log("NO ACCESS")
        redirect("/explorer");
    }
    const user : User | null = await getSession();

    if (!user)
        return (<FetchInformationError error={"Failed to load user information."}/>);

    return (
        <SidebarProvider>
            <Header accessToken={accessToken} user_id={user?.id}/>
            <SidebarTrigger className="stroke-white "/>
            <MainContent userData={user}/>
        </SidebarProvider>
    );
}
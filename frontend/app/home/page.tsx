import Header from "@/components/Header";
import MainContent from "@/app/home/components/MainContent";
import { getAccessToken, getSession } from "../lib/authentication";
import { redirect } from "next/navigation";
import { User } from "../types/User";
import FetchInformationError from "../account/components/Errors/FetchInformationError";

export default async function Home() {
    const accessToken: string | null = await getAccessToken();

    if(! accessToken )
        redirect("/auth/sign-in");

    const user : User | null = await getSession();

    // Handle error state
    if (!user)
        return (<FetchInformationError error={"Failed to load user information."}/>);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-950 to-gray-800 flex flex-col">
            <Header accessToken={accessToken} user_id={user.id}/>
            <MainContent userData={user}/>
        </div>
    );
}
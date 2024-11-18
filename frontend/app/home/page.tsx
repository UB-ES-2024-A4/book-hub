import Header from "@/components/Header";
import MainContent from "@/app/home/components/MainContent";
import {cookies} from "next/headers";
import {getAccessToken} from "@/app/lib/authentication";

export default async function Home() {

    const accessToken: string | null = await getAccessToken();


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-200 flex flex-col">
            <Header accessToken={accessToken}/>
            <MainContent/>
        </div>
    )
}
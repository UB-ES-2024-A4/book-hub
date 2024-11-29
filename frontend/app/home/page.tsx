import Header from "@/components/Header";
import MainContent from "@/app/home/components/MainContent";
import { getAccessToken, getSession } from "../lib/authentication";
import { redirect } from "next/navigation";
import { User } from "../types/User";
import FetchInformationError from "../account/components/Errors/FetchInformationError";

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
        <div className="min-h-screen bg-gradient-to-br bg-[#051B32] flex flex-col pl-0 md:pl-60">
            <Header accessToken={accessToken} user_id={user.id}/>
            <MainContent userData={user}/>
        </div>
    );
}
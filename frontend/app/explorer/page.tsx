import Header from "@/components/Header";
import {getAccessToken, getSession} from "@/app/lib/authentication";
import {User} from "@/app/types/User";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";

export default async function Explorer() {

    const accessToken: string | null = await getAccessToken();
    const user : User | null = await getSession();

    if (!user || !accessToken)
        return (<FetchInformationError error={"Failed to load user information."}/>);

    return (
        <div className="min-h-screen flex items-center justify-center
    bg-gradient-to-br from-blue-950 to-blue-200">
            <Header accessToken={accessToken} user_id={user.id}/>
            <h1 className="text-4xl font-bold">Explorer</h1>
        </div>
    );
}
import Header from "@/components/Header";
import {getAccessToken} from "@/app/lib/authentication";

export default async function Explorer() {

    const accessToken: string | null = await getAccessToken();

    return (
        <div className="min-h-screen flex items-center justify-center
    bg-gradient-to-br from-blue-950 to-blue-200">
            <Header accessToken={accessToken}/>
            <h1 className="text-4xl font-bold">Explorer</h1>
        </div>
    );
}
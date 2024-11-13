"use client";
import ProfileHeader from "@/app/account/components/ProfileHeader";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";
import {useState} from "react";
import {User} from "@/app/types/User";

type Props = {
    userData: User;
}

export default  function MainContent({userData}: Props) {
    // Fetch user data
    const [user, setUser] = useState(userData);

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="mx-2">
                {user && <ProfileHeader userData={user} setUser={setUser}/>}
            </div>
            {/* <div className="pt-4">
                        {user && <Tabs userData={user}  setUser={setUser}/>}
                    </div> */}
        </div>
    )
}
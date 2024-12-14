"use client";
import ProfileHeader from "@/app/profile/components/ProfileHeader";
import FetchInformationError from "@/app/account/components/Errors/FetchInformationError";
import {useState} from "react";
import {User} from "@/app/types/User";

type Props = {
    userData: User | null;
}

export default  function MainContent({userData}: Props) {
    // Fetch user data
    //const [user, setUser] = useState(userData);

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="mx-2">
                {userData && <ProfileHeader userData={userData}/>}
            </div>
            {/* <div className="pt-4">
                        {user && <Tabs userData={user}  setUser={setUser}/>}
                    </div> */}
        </div>
    )
}
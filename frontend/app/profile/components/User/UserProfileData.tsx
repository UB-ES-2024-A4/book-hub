import React, {useState} from "react";
import {User} from "@/app/types/User";

import {PropsUser} from "@/app/types/PropsUser";

type Props = {
  userProfile: User | null;
}

export default function UserProfileData ({userProfile}: Props) {

    return (
        <div className="pt-16 px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                <div className="lg:col-span-3">
                    <h2 className="text-3xl font-bold">{userProfile?.first_name} {userProfile?.last_name}</h2>
                    <p className="text-gray-600">@{userProfile?.username}</p>
                    <p className="mt-2 text-gray-700">{userProfile?.biography}</p>
                </div>
            </div>
        </div>
    )
}
import React, {useState} from "react";
import {User} from "@/app/types/User";
import {Button} from "@/components/ui/button";

import {PropsUser} from "@/app/types/PropsUser";

type Props = {
  userProfile: User | null;
  currentUserId: Number | undefined
}

export default function UserProfileData ({userProfile, currentUserId}: Props) {

    return (
        <div className="pt-16 px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                <div className="lg:col-span-3">
                    <h2 className="text-3xl font-bold">{userProfile?.first_name} {userProfile?.last_name}</h2>
                    <p className="text-gray-600">@{userProfile?.username}</p>
                    <p className="mt-2 text-gray-700">{userProfile?.biography}</p>
                </div>
                <div className="flex flex-col space-y-2 lg:items-end">
                    {currentUserId && currentUserId !== userProfile?.id && (
                        <Button
                            variant={userProfile?.following ? "default" : "outline"}
                            className={`relative h-8 ${userProfile?.following ? "bg-gray-500" : "bg-blue-500"} text-white font-semibold py-2 px-4 rounded-l-md group`}
                        >
                            {userProfile?.following ? "Following" : "Follow"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
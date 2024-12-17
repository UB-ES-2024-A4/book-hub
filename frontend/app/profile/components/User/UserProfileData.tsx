import React, { useState } from "react";
import {User} from "@/app/types/User";
import {Button} from "@/components/ui/button";
import { followUser, unfollowUser } from "@/app/actions";
import { toast } from "nextjs-toast-notify";


type Props = {
  userProfile: User;
  currentUserId: number | undefined
}

export default function UserProfileData ({userProfile, currentUserId}: Props) {

    const [following, setFollowing] = useState<boolean | undefined>(userProfile?.following);

    // Handle follow/unfollow button click
    const handleFollowClick = async (
        userProfileId: number,
        isCurrentlyFollowing: boolean | undefined,
        currentUserId: number,
        updateFollowingState: (following: boolean) => void
    ) => {
        try {
        if (isCurrentlyFollowing) {
            const result = await unfollowUser(currentUserId, userProfileId);
            if (result.status !== 200) throw new Error(result.message);
        } else {
            const result = await followUser(currentUserId, userProfileId);
            if (result.status !== 200) throw new Error(result.message);
        }

        // Update the local state to reflect the change
        updateFollowingState(!isCurrentlyFollowing);

        } catch (error: any) {
            console.error("Failed to update following status", error);

            // Show a toast notification
            toast.error(error.message, {
                duration: 4000,
                progress: true,
                position: "top-center",
                transition: "swingInverted",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n' +
                    '  <circle cx="12" cy="12" r="10"/>\n' +
                    '  <line x1="12" y1="8" x2="12" y2="12"/>\n' +
                    '  <line x1="12" y1="16" x2="12.01" y2="16"/>\n' +
                    '</svg>',
                sonido: true,
            });
        }
    };

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
                            variant={following ? "default" : "outline"}
                            className={`relative h-8 ${following ? "bg-gray-500" : "bg-blue-500"} text-white font-semibold py-2 px-4 rounded-l-md group`}
                            onClick={() => handleFollowClick(userProfile?.id, following, currentUserId, setFollowing)}
                        >
                            {following ? "Following" : "Follow"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
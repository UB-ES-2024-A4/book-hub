import {Button} from "@/components/ui/button";
import {Edit2} from "lucide-react";
import React, {useState} from "react";
import {User} from "@/app/types/User";
import ProfileDialog from "@/app/account/components/Dialogs/ProfileDialog";

import {PropsUser} from "@/app/types/PropsUser";

export default function UserProfileData ({userData, setUser}: PropsUser) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

    return (
        <div className="pt-16 px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                <div className="lg:col-span-3">
                    <h2 className="text-3xl font-bold">{userData.first_name} {userData.last_name}</h2>
                    <p className="text-gray-600">@{userData.username}</p>
                    <p className="mt-2 text-gray-700">{userData.biography}</p>
                </div>
                <div className="flex flex-col space-y-2 lg:items-end">
                    <Button variant="outline" onClick={handleEdit}
                            className="w-full lg:w-auto shadow-sm shadow-black path">
                        <Edit2 className="mr-2 h-4 w-4"/> Edit Profile
                    </Button>
                </div>
            </div>

      <ProfileDialog
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        userData = {userData}
        setUser = {setUser}
      />
        </div>
    )
}
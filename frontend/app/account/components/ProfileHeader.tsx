'use client';

import React, { useState } from 'react';
import { PropsUser } from "@/app/types/PropsUser";
import {putProfilePictureBackend} from "@/app/actions";
import UserProfilePicture from "@/app/account/components/User/UserProfilePicture";
import UserProfileData from "@/app/account/components/User/UserProfileData";

import "nextjs-toast-notify/dist/nextjs-toast-notify.css";
export default function ProfileHeader({ userData, setUser }: PropsUser) {
  const [isHovering, setIsHovering] = useState(false);

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Changing profile picture:', file);

      const formData = new FormData();
      formData.append('file', file);

      // Upload the file to the backend
      await putProfilePictureBackend(formData, userData.id);
    }
  }
  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <UserProfilePicture userDataMock={userData} setIsHovering={setIsHovering}
                            isHovering={isHovering} handleProfilePictureChange={handleProfilePictureChange}/>

        <UserProfileData userData={userData} setUser={setUser}/>
      </div>

    </div>
  );
}
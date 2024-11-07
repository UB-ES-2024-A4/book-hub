'use client';

import React, { useEffect, useState } from 'react';
import ProfileDialog from "@/app/account/components/Dialogs/ProfileDialog";
import { PropsUser } from "@/app/types/PropsUser";
import {fetchProfilePictureUser, putProfilePictureBackend} from "@/app/actions";
import UserProfilePicture from "@/app/account/components/User/UserProfilePicture";
import UserProfileData from "@/app/account/components/User/UserProfileData";

export default function ProfileHeader({ userData }: PropsUser) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(userData);
  const [userDataMock, setUserData] = useState(userData);
  const [isHovering, setIsHovering] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");


  async function fetchProfilePicture() {
    try {
      await fetchProfilePictureUser(userData.id).then(url=>setProfilePictureUrl(url));
    } catch (error) {
      console.error("Failed to fetch the image", error);
    }
  }

  useEffect(() => {
    fetchProfilePicture().then();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };


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
        <UserProfilePicture userDataMock={userDataMock} setIsHovering={setIsHovering}
                            isHovering={isHovering} handleProfilePictureChange={handleProfilePictureChange}/>

        <UserProfileData userDataMock={userDataMock} handleEdit={handleEdit}/>
      </div>

      <ProfileDialog
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editedUser={editedUser}
        setEditedUser={setEditedUser}
        setUserData={setUserData}
      />
    </div>
  );
}
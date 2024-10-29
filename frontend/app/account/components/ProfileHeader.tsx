'use client';

import React, { useEffect, useState } from 'react';
import { Edit2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import ProfileDialog from "@/app/account/components/ProfileDialog";
import { PropsUser } from "@/app/types/PropsUser";
import { Camera } from 'lucide-react';

export default function ProfileHeader({ userData }: PropsUser) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(userData);
  const [userDataMock, setUserData] = useState(userData);
  const [isHovering, setIsHovering] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(userData.profilePicture);

  let path = `http://127.0.0.1:8000/users/pfp/${userData.id}`;

  useEffect(() => {
    async function fetchProfilePicture() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/pfp/${userData.id}`);
        if (response.ok) {
          setProfilePictureUrl(`http://127.0.0.1:8000/users/pfp/${userData.id}`);
        } else {
          console.error("Error fetching the profile image");
        }
      } catch (error) {
        console.error("Failed to fetch the image", error);
      }
    }
    fetchProfilePicture();

  }, [userData.id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Changing profile picture:', file.name);
      const newProfilePictureUrl = URL.createObjectURL(file);
      setUserData(prev => ({ ...prev, profilePicture: newProfilePictureUrl }));
      setProfilePictureUrl(newProfilePictureUrl); // Actualiza el estado de `profilePictureUrl`

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`http://127.0.0.1:8000/users/pfp/${userDataMock.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        console.error("Error uploading the profile picture");
      }
    }
  };

  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative">
          <Image
            src={userDataMock.coverPhoto || "/placeholder.svg?height=600&width=800&text=Cover+Photo"}
            alt="Cover Photo"
            width={800}
            height={600}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <div
              className="relative"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Image
                src={path || "/book.jpg"}
                alt={`${userDataMock.firstName}'s profile picture`}
                width={100}
                height={100}
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <label
                htmlFor="profile-picture-input"
                className={`absolute bottom-0 right-0 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-75 hover:opacity-100'}`}
              >
                <Camera className="h-5 w-5 text-white" />
                <span className="sr-only">Change profile picture</span>
              </label>
              <input
                id="profile-picture-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange}
                aria-label="Change profile picture"
              />
            </div>
          </div>
        </div>
        <div className="pt-16 px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-bold">{userDataMock.firstName} {userDataMock.lastName}</h2>
              <p className="text-gray-600">@{userDataMock.username}</p>
              <p className="mt-2 text-gray-700">{userDataMock.bio}</p>
            </div>
            <div className="flex flex-col space-y-2 lg:items-end">
              <Button variant="outline" onClick={handleEdit} className="w-full lg:w-auto shadow-sm shadow-black path">
                <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </div>
        </div>
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

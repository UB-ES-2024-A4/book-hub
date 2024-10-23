'use client';

import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import ProfileDialog from "@/app/account/components/ProfileDialog";
import {PropsUser} from "@/app/types/PropsUser";
export default function ProfileHeader({ userData }: PropsUser) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(userData);
  const [userDataMock, setUserData] = useState(userData);


  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
      <div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="relative">
                  <Image src={userDataMock.coverPhoto || "book.jpeg"} alt="Cover" width={500} height={200}
                         className="w-full h-48 object-cover"/>
                  <div className="absolute bottom-0 left-8 transform translate-y-1/2">
                      <Image src={userDataMock.profilePicture || "book.jpeg"} alt={userDataMock.fullName} width={100} height={100}
                           className="w-24 h-24 rounded-full border-4 border-white"/>
                  </div>
              </div>
              <div className="pt-16 px-8 pb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                      <div className="lg:col-span-3">
                          <h2 className="text-3xl font-bold">{userDataMock.fullName}</h2>
                          <p className="text-gray-600">@{userDataMock.username}</p>
                          <p className="mt-2 text-gray-700">{userDataMock.bio}</p>
                      </div>
                      <div className="flex flex-col space-y-2 lg:items-end ">
                          <Button className="w-full lg:w-auto">Follow</Button>
                          <Button variant="outline" onClick={handleEdit} className="w-full lg:w-auto">
                              <Edit2 className="mr-2 h-4 w-4"/> Edit Profile
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
          <ProfileDialog isEditing={isEditing} setIsEditing={setIsEditing} editedUser={editedUser}
                         setEditedUser={setEditedUser} setUserData={setUserData}/>
      </div>

  );
}

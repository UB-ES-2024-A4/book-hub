'use client';

import React, { useState } from 'react';
import { PropsUser } from "@/app/types/PropsUser";
import UserProfilePicture from "@/app/profile/components/User/UserProfilePicture";
import UserProfileData from "@/app/profile/components/User/UserProfileData";

import "nextjs-toast-notify/dist/nextjs-toast-notify.css";
export default function ProfileHeader({ userData}: PropsUser) {

  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <UserProfilePicture userDataMock={userData}/>

        <UserProfileData userData={userData}/>
      </div>

    </div>
  );
}
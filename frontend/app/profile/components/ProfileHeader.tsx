'use client';

import React, { useState } from 'react';
import { PropsUser } from "@/app/types/PropsUser";
import UserProfilePicture from "@/app/profile/components/User/UserProfilePicture";
import UserProfileData from "@/app/profile/components/User/UserProfileData";

import "nextjs-toast-notify/dist/nextjs-toast-notify.css";
import { User } from '@/app/types/User';

type Props = {
    userData: User | null;
    userProfile: User | null;
}

export default function ProfileHeader({ userData, userProfile}: Props) {

  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <UserProfilePicture userDataMock={userProfile}/>

        <UserProfileData userProfile={userProfile}/>
      </div>

    </div>
  );
}
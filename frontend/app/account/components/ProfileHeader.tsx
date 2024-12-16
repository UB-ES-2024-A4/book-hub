'use client';

import React, { useState } from 'react';
import { PropsUser } from "@/app/types/PropsUser";
import {putProfilePictureBackend} from "@/app/actions";
import UserProfilePicture from "@/app/account/components/User/UserProfilePicture";
import UserProfileData from "@/app/account/components/User/UserProfileData";
import imageCompression from "browser-image-compression";

import "nextjs-toast-notify/dist/nextjs-toast-notify.css";
export default function ProfileHeader({ userData, setUser }: PropsUser) {
  const [isHovering, setIsHovering] = useState(false);

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
     
      const options = {
        maxSizeMB: 0.001, // Tamaño máximo de 1 KB (1 / 1024 MB)
        maxWidthOrHeight: 200, // Escala máxima en píxeles
        useWebWorker: true, // Usa Web Worker para optimizar
        initialQuality: 0.1, // Empieza con una calidad baja
      };

      console.log("Compressing iimage");


      let compressedImage: File | undefined;
      if (file && file instanceof File) {
          compressedImage = await imageCompression(file, options);
      } else {
          throw new Error("Invalid file");
      }
      
      console.log("Image compressed");

      const formData = new FormData();
      formData.append('file', compressedImage);
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
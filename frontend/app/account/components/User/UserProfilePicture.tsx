"use client";
import Image from "next/image";
import {Camera} from "lucide-react";
import React, {useState} from "react";
import {User} from "@/app/types/User";
import { useFeed } from "@/contex/FeedContext";

const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;

type Props = {
    userDataMock: User;
    setIsHovering: React.Dispatch<React.SetStateAction<boolean>>;
    handleProfilePictureChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isHovering: boolean;
}

export default function UserProfilePicture ({userDataMock, setIsHovering, isHovering, handleProfilePictureChange}: Props) {
    // TODO accept other formats
    const {urlImage,changeUrlImage} = useFeed();

    const [imageReload, setImageUrl] = useState(NEXT_PUBLIC_STORAGE_PROFILE_PICTURES + `/${userDataMock.id}.png`);

    console.log("Image URL", imageReload);

    const reloadImage = () => {
        setImageUrl(NEXT_PUBLIC_STORAGE_PROFILE_PICTURES + `/${userDataMock.id}.png?timestamp=${new Date().getTime()}`);
        changeUrlImage(NEXT_PUBLIC_STORAGE_PROFILE_PICTURES + `/${userDataMock.id}.png?timestamp=${new Date().getTime()}`);
        console.log("Image reloaded", userDataMock.id);
    }

    function setImageSrc(s: string) {
        setImageUrl(s);
    }

    return (
        <div className="relative">
            <Image
                src={"/book.jpg"}
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
                        key={imageReload}
                        src={ urlImage }
                        alt={`${userDataMock.first_name}'s picture`}
                        width={100}
                        height={100}
                        className="w-24 h-24 rounded-full border-4 object-cover border-white bg-white"
                        onError={() => setImageSrc("/logo.png")}
                    />
                    <label
                        htmlFor="profile-picture-input"
                        className={`absolute bottom-0 right-0 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center 
                    cursor-pointer transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-75 hover:opacity-100'}`}
                    >
                        <Camera className="h-5 w-5 text-white"/>
                        <span className="sr-only">Change profile picture</span>
                    </label>
                    <input
                        id="profile-picture-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (event) => {
                            await handleProfilePictureChange(event);
                            console.log("Profile picture changed");
                            reloadImage();
                        }}
                        aria-label="Change profile picture"
                    />
                </div>
            </div>
        </div>
    );
}
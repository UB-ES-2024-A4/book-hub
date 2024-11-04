import Image from "next/image";
import {Camera} from "lucide-react";
import React from "react";
import {User} from "@/app/types/User";

type Props = {
    userDataMock: User;
    profilePictureUrl: string;
    setIsHovering: React.Dispatch<React.SetStateAction<boolean>>;
    handleProfilePictureChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isHovering: boolean;
}

export default function UserProfilePicture ({userDataMock, profilePictureUrl, setIsHovering, isHovering, handleProfilePictureChange}: Props) {
    return (
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
                        key={profilePictureUrl}
                        src={profilePictureUrl || "/book.jpg"}
                        alt={`${userDataMock.firstName}'s profile picture`}
                        width={100}
                        height={100}
                        className="w-24 h-24 rounded-full border-4 border-white"
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
                        onChange={handleProfilePictureChange}
                        aria-label="Change profile picture"
                    />
                </div>
            </div>
        </div>
    );
}
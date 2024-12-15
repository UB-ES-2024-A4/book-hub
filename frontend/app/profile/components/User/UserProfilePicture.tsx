"use client";
import Image from "next/image";
import React from "react";
import {User} from "@/app/types/User";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;

type Props = {
    userDataMock: User | null;
}

export default function UserProfilePicture ({userDataMock}: Props) {

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
                >
                    <Avatar className="w-24 h-24 rounded-full border-4 border-white bg-white">
                        <AvatarImage 
                            src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}` + `/${userDataMock?.id}.png`}
                            alt={`${userDataMock?.first_name}'s picture`}
                            width={100}
                            height={100}
                            className="w-24 h-24 rounded-full border-4 border-white bg-white"
                        />
                        <Image src={'/logo.png'} alt='' width={100} height={100} />
                    </Avatar>
                </div>
            </div>
        </div>
    );
}
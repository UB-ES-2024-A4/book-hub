//import {Button} from "@/components/ui/button";
//import {Edit2} from "lucide-react";
import React from "react";
import {User} from "@/app/types/User";

type Props = {
    userDataMock: User;
    //eslint-disable-next-line
    handleEdit: () => void;
}
//eslint-disable-next-line
export default function UserProfileData ({userDataMock, handleEdit}: Props) {
    return (
        <div className="pt-16 px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                <div className="lg:col-span-3">
                    <h2 className="text-3xl font-bold">{userDataMock.firstName} {userDataMock.lastName}</h2>
                    <p className="text-gray-600">@{userDataMock.username}</p>
                    <p className="mt-2 text-gray-700">{userDataMock.bio}</p>
                </div>
                {/*<div className="flex flex-col space-y-2 lg:items-end">
                    <Button variant="outline" onClick={handleEdit}
                            className="w-full lg:w-auto shadow-sm shadow-black path">
                        <Edit2 className="mr-2 h-4 w-4"/> Edit Profile
                    </Button>
                </div>*/}
            </div>
        </div>
    )
}
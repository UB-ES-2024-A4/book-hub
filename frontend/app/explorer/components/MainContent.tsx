"use client";

import React from "react";
import { User } from "@/app/types/User";
import ScrollAreaExplorer from "@/app/explorer/components/ScrollAreaExplorer";

type Props = {
    userData: User;
}

export default function MainContent({ userData }: Props){

    return (
        <div className="flex-1 flex-col md:flex-row overflow-x-auto pt-10">
            <ScrollAreaExplorer userData={userData}/>
        </div>
    )
}
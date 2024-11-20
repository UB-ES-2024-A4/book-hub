import {User} from "@/app/types/User";
import React from "react";

export type PropsUser = {
    userData: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
};
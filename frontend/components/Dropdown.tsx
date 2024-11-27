import React, { useState } from 'react'
import Link from 'next/link';

import { MenuItem } from './Header';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DropdownProps {
    item: MenuItem;
    user_id: number;
}

const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;
const NEXT_PUBLIC_AZURE_SAS_STORAGE = process.env.NEXT_PUBLIC_AZURE_SAS_STORAGE;

export default function Dropdown({item, user_id}: DropdownProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const menuItems = item?.children ? item.children : [];

    const toggle = () => {
        setIsOpen(old => !old);
    }

    const transClass = isOpen ? "flex" : "hidden";

    return (
        <>
            <div className="relative">
                <Avatar className="w-10 h-10 border-2 border-blue-400" onClick={toggle}>
                    <AvatarImage src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}/${user_id}.png`}/>
                    <img src={'/logo.png'} alt=''/>
                </Avatar>
                <div className={`absolute top-8 z-30 w-[250px] min-h-[100px] flex flex-col py-4 bg-zinc-400 rounded-md bg-black/40 ${transClass}`}>
                    {
                        menuItems.map(item =>
                            <Link
                                key={item.route}
                                className="hover:bg-zinc-300 hover:text-zinc-500 px-4 py-1"
                                href={item?.route || ''}
                                onClick={toggle}
                            >{item.title}</Link>
                        )
                    }
                </div>
            </div>
            { isOpen ?
                    <div
                        className="fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/40"
                        onClick={toggle}
                    ></div>
                    :
                    <></>
            }
        </>
    )
}
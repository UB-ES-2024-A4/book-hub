import React, { useState } from 'react'
import Link from 'next/link';

import { MenuItem } from './Header';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { logOut } from "@/app/actions";
import Image from 'next/image';
import { useFeed } from '@/contex/FeedContext';

interface DropdownProps {
    item: MenuItem;
    user_id: number | undefined;
}

const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;
const NEXT_PUBLIC_AZURE_SAS_STORAGE = process.env.NEXT_PUBLIC_AZURE_SAS_STORAGE;

export default function Dropdown({item, user_id}: DropdownProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const menuItems = item?.children ? item.children : [];

    const toggle = () => {
        setIsOpen(old => !old);
    }

    const transClass = isOpen ? "flex" : "invisible";

    const handleLogout = async () => {
        await logOut();
    }
    const {urlImage} = useFeed();

    return (
        <>
            <div className="relative cursor-pointer">
                <Avatar className="w-14 h-14 border-2 border-blue-400 bg-white" onClick={toggle}>
                    <AvatarImage src={urlImage}/>
                    <Image className='object-cover' src={'/logo.png'} alt='' width={56} height={56} />
                </Avatar>
                <div className={`absolute z-30 flex flex-col bg-zinc-400 rounded-md bg-black/40 transition-all duration-500 ease-in-out transform ${transClass} ${
                        isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 -translate-y-2'
                    }`}

                    style={{ width: 130 }}>
                    {
                        menuItems.map(item =>
                            <Link
                                key={item.route}
                                className={item.title == 'Log Out' ? "hover:bg-red-500 hover:text-zinc-950 rounded-md px-4 py-2 " : "hover:bg-blue-300 rounded-md px-4 py-2"}
                                href={item?.route || ''}
                                onClick={item.title == 'Log Out' ? handleLogout : toggle}
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
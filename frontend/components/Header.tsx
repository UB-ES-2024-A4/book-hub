"use client";

import React, {useEffect, useState} from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import CreatePostButton from "@/components/CreatePostButton";
import { CreatePostDialog } from "@/components/dialog/CreatePostDialog";
import { Filter } from "@/app/types/Filter";
import { loadFilters } from "@/app/actions";
import "nextjs-toast-notify/dist/nextjs-toast-notify.css";
import {toast} from "nextjs-toast-notify";
import {useFeed} from "@/contex/FeedContext";
import Image from "next/image";
import Dropdown from "./Dropdown";


type HeaderProps = {
    accessToken: string | null;
    user_id: number | undefined;
}

export interface MenuItem {
    title: string;
    route?: string;
    children?: MenuItem[];
}

const menuItems: MenuItem[] = [
    {
      title: "Account",
      children: [
        {
          title: "My Profile",
          route: "/account",
        },
        {
          title: "Log Out",
          route: '/sign-in'
        },
      ],
    },
  ];
const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;

export default function Header({accessToken, user_id}: HeaderProps) {
    const { addAllFilters, filters, changeUrlImage } = useFeed();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    useEffect(() => {
        console.log("SE EJECUTA FILTROS 1");
        async function fetchFilters() {
            if(filters && Object.keys(filters).length > 0) return;

            const result = await loadFilters();

            console.log("Filters IN THE HEADER", result.data);

            if (result.status !== 200) {
                toast.error(result.message, {
                    duration: 4000,
                    progress: true,
                    position: "top-left",
                    transition: "swingInverted",
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
                    sonido: true,
                });
                return;
            } else {
                const filters : Filter[] = result.data;
                const filtersObject: { [key: number]: string } = {};
                filters.forEach(filter => {
                    filtersObject[filter.id] = filter.name;
                });
                addAllFilters(filtersObject);
            }

            changeUrlImage(NEXT_PUBLIC_STORAGE_PROFILE_PICTURES + `/${user_id}.png?timestamp=${new Date().getTime()}`);
        }

        fetchFilters();
    }, []);

    return (
        <>
            <header className="bg-[#051B32] shadow-md shadow-blue-400 fixed z-50 top-0 left-0 right-0
                                md:bottom-0 md:w-40 lg:w-52 md:right-auto flex flex-col">
                <div className="container mx-auto flex justify-between items-center pl-4 pt-2 md:flex-col md:items-start">
                     <Link href="/home" className="text-[#4066cf] text-2xl font-bold md:hidden">
                        BookHub
                    </Link>
                    <button className="md:hidden flex items-center text-gray-400 focus:outline-none pr-4" onClick={toggleMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/>
                        </svg>
                    </button>
                </div>

                <nav className={`${isMenuOpen ? 'flex' : 'hidden'} h-full md:flex flex-col space-y-4 p-4 flex-grow`}>
                    {/* Navigation Links */}
                    <div className="flex flex-col space-y-4">
                        {accessToken && (
                            <Link href="/home"
                                  className={`path transition-colors duration-300 ${pathname === '/home' ? 'text-blue-600' : 'text-gray-300'}`}
                                  onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>
                        )}
                        <Link href="/explorer"
                              className={`path transition-colors duration-300 ${pathname === '/explorer' ? 'text-blue-600' : 'text-gray-300'}`}
                              onClick={() => setIsMenuOpen(false)}>
                            Explorer
                        </Link>
                        {accessToken && (
                            <CreatePostButton openDialog={openDialog} />
                        )}
                        {!accessToken ? null : ( <div className="flex gap-8 items-center text-white">
                        {menuItems.map((item) => {
                            <div key={item.title}></div>
                        return <div key={item.title}> <Dropdown item={item} user_id={user_id} /></div>
                        })}
                    </div> )}
                    </div>
                </nav>

                {/* App Title */}
                <div className="p-4 mt-auto text-left md:text-left">
                    <Link href="/home" className="text-[#4066cf] text-2xl font-bold hidden md:block">
                        BookHub
                    </Link>
                </div>
            </header>

            {filters ? <CreatePostDialog open={isDialogOpen} setIsDialogOpen={setIsDialogOpen} user_id={user_id}/> : null }
        </>
    );
}

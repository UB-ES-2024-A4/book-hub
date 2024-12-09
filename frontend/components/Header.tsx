"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import CreatePostButton from "@/components/CreatePostButton";
import { CreatePostDialog } from "@/components/dialog/CreatePostDialog";
import { Filter } from "@/app/types/Filter";
import { loadFilters } from "@/app/actions";
import "nextjs-toast-notify/dist/nextjs-toast-notify.css";
import { toast } from "nextjs-toast-notify";
import { useFeed } from "@/contex/FeedContext";
import Dropdown from "./Dropdown";
import { Compass, Home, CirclePlus, Search, X } from 'lucide-react';

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

export default function Header({accessToken, user_id}: HeaderProps) {
    const { addAllFilters, filters } = useFeed();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const pathname = usePathname();

    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const toggleSearch = () => {
        setIsSearchActive(!isSearchActive);
        setSearchValue("");
    }

    useEffect(() => {
        async function fetchFilters() {
            if(filters && Object.keys(filters).length > 0) return;

            const result = await loadFilters();

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
        }

        fetchFilters();
    }, []);

    return (
        <>
            <header className="bg-[#051B32] shadow-md shadow-blue-400 fixed z-50 top-0 left-0 right-0
                                md:bottom-0 md:w-16 lg:w-64 md:right-auto flex flex-col">
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
                    <div className="flex flex-col space-y-4">
                        {accessToken && (
                            <Link href="/home"
                                  className={`path transition-colors duration-300 flex items-center space-x-2 ${pathname === '/home' ? 'text-blue-600' : 'text-gray-300'}`}
                                  onClick={() => setIsMenuOpen(false)}>
                                <Home size={24} />
                                <span className="hidden lg:inline">Home</span>
                            </Link>
                        )}
                        <Link href="/explorer"
                              className={`path transition-colors duration-300 flex items-center space-x-2 ${pathname === '/explorer' ? 'text-blue-600' : 'text-gray-300'}`}
                              onClick={() => setIsMenuOpen(false)}>
                            <Compass size={24} />
                            <span className="hidden lg:inline">Explorer</span>
                        </Link>

                        <button
                            className={`path flex items-center space-x-2 focus:outline-none ${isSearchActive ? 'text-blue-600' : 'text-gray-300'}`}
                            onClick={toggleSearch}
                        >
                            {isSearchActive ? <X size={24} /> : <Search size={24} />}
                            <span className="hidden lg:inline">Search</span>
                        </button>

                        {accessToken && (
                            <div className="path transition-colors duration-300 flex items-center space-x-2 text-gray-300">
                                <CirclePlus size={24} />
                                <span className="hidden lg:inline">
                                    <CreatePostButton openDialog={openDialog}/>
                                </span>
                            </div>
                        )}
                        {!accessToken ? null : (
                            <div className="flex gap-8 items-center text-white">
                                {menuItems.map((item) => (
                                    <div key={item.title}><Dropdown item={item} user_id={user_id}/></div>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                <div className="p-4 mt-auto text-left md:text-left">
                    <Link href="/home" className="text-[#4066cf] text-2xl font-bold hidden md:block lg:inline">
                        BookHub
                    </Link>
                </div>
            </header>

            {isSearchActive && (
                <div className="absoulte bg-[#051B32] z-40 flex items-center justify-center " style={{transform: 'translateX(0%)'}}>
                    <div className="w-full max-w-3xl px-4">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>
            )}

            {filters && (
                <CreatePostDialog open={isDialogOpen} setIsDialogOpen={setIsDialogOpen} user_id={user_id}/>
            )}
        </>
    );
}


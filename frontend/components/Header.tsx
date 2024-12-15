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
import Image from "next/image";
import {User} from "@/app/types/User";

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
    const [searchResults, setSearchResults] = useState([]);

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

    const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    // Implement your search logic here
    // setSearchResults(filteredUsers);
    };

    const handleUserSelect = (user: User) => {
        // Handle user selection logic
        toggleSearch(); // Close search after selection
    };

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
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ' +
                        'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
                        'class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
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
            <header className="flex flex-col md:flex-row h-full">

                <div className={`bg-[#051B32] shadow-md shadow-blue-400 top-0 left-0 flex flex-col md:h-screen fixed
                    transition-all duration-300 ease-in-out ${isSearchActive ? 'w-20' : 'w-full md:w-52'}`}
                >

                    <div className="container mx-auto flex justify-between
                        items-center pl-4 pt-2 md:flex-col md:items-start">

                        <Link href="/home" className={`text-[#4066cf] text-2xl font-bold md:hidden`}>
                            BookHub
                        </Link>

                        <button className="md:hidden flex items-center text-gray-400 focus:outline-none pr-4"
                                onClick={toggleMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 6h16M4 12h16m-7 6h7"/>
                            </svg>
                        </button>
                    </div>

                    <nav
                        className={`${isMenuOpen ? 'flex' : 'hidden'} h-full md:flex flex-col space-y-4 p-4 flex-grow`}>
                        <div className="flex flex-col space-y-4">
                            {!accessToken ? null : (
                                <div className="flex gap-8 items-center text-white">
                                    {menuItems.map((item) => (
                                        <div key={item.title}><Dropdown item={item} user_id={user_id}/></div>
                                    ))}
                                </div>
                            )}
                            {accessToken && (
                                <Link href="/home"
                                      className={`path transition-colors duration-300 flex items-center space-x-2 ${pathname === '/home' ? 'text-blue-600' : 'text-gray-300'}`}
                                      onClick={() => setIsMenuOpen(false)}>
                                    <Home size={24}/>
                                    <span
                                        className={`${isSearchActive ? 'hidden' : 'block'} transition-all duration-400 ease-in-out text-gray-300`}>Home</span>
                                </Link>
                            )}
                            <Link href="/explorer"
                                  className={`path transition-colors duration-300 flex items-center space-x-2 ${pathname === '/explorer' ? 'text-blue-600' : 'text-gray-300'}`}
                                  onClick={() => setIsMenuOpen(false)}>
                                <Compass size={24}/>
                                <span
                                    className={`${isSearchActive ? 'hidden' : 'block'} transition-all duration-400 ease-in-out text-gray-300`}>Explorer</span>
                            </Link>

                            <button
                                className={`path flex items-center space-x-2 focus:outline-none ${isSearchActive ? 'text-blue-600' : 'text-gray-300'}`}
                                onClick={toggleSearch}
                            >
                                {isSearchActive ? <X size={24}/> : <Search size={24}/>}
                                <span
                                    className={`${isSearchActive ? 'hidden' : 'block'} transition-all duration-400 ease-in-out text-gray-300`}>Search</span>
                            </button>

                            {accessToken && (
                                <div
                                    className="path transition-colors duration-300 flex items-center space-x-2 text-gray-300">
                                    <CirclePlus size={24}/>
                                    <span
                                        className={`${isSearchActive ? 'hidden' : 'block'} transition-all duration-400 ease-in-out text-gray-300`}>
                                                <CreatePostButton openDialog={openDialog}/>
                                            </span>
                                </div>
                            )}
                        </div>
                    </nav>

                    <div className={`p-4 mt-auto text-left md:text-left ${isSearchActive ? 'hidden' : 'block'}`}>
                        <Link href="/home"
                              className="text-[#4066cf] text-2xl font-bold hidden md:block lg:inline">
                            BookHub
                        </Link>
                    </div>

                </div>

                {/* Contenedor Principal */}
                {isSearchActive && (
                <div className={`
                    fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ease-in-out 
                    ${isSearchActive ? 'w-full h-full' : 'w-0 h-0 overflow-hidden'}
                `}>
                    {/* Search Background Overlay */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={toggleSearch}
                    />

                {/* Search Content Container */}
                <div className={`
                    absolute top-0  left-0 right-0 bg-[#051B32] shadow-lg shadow-blue-900/50 
                    transition-all duration-300 ease-in-out w-full max-w-md mx-auto mt-4 rounded-xl 
                    overflow-hidden ${isSearchActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                `}>
                    {/* Search Input Section */}
                    <div className="p-4 bg-[#051B32]">
                        <div className="relative">
                            <h1 className="text-xl font-bold text-gray-200 pb-2">Search</h1>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search username or full name"
                                    className="
                                        pl-10
                                        pr-4
                                        py-2
                                        bg-gray-800
                                        text-white
                                        rounded-lg
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                        w-full"
                                    value={searchValue}
                                    onChange={handleInputChange}
                                    autoFocus
                                />
                                <Search
                                    size={20}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                {/* Search Results Section */}
                <div className="max-h-[70vh] overflow-y-auto px-4 py-2 bg-[#051B32]">
                    {searchValue ? (
                        <div>
                            <h3 className="text-gray-400 mb-4 font-semibold">Search Results</h3>
                            <div className="space-y-3">
                                {searchResults.map((user: User, index) => (
                                    <div
                                        key={index}
                                        className="
                                            bg-gray-800
                                            rounded-lg
                                            p-3
                                            flex
                                            items-center
                                            hover:bg-gray-700
                                            transition-colors
                                            cursor-pointer
                                        "
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        <Image
                                            src={'/logo.png'}
                                            alt="NAME" width={40} height={40}
                                            className="w-10 h-10 rounded-full mr-3 object-cover"
                                        />
                                        <div>
                                            <p className="text-white font-semibold">Username</p>
                                            <p className="text-gray-400 text-sm"> Full Name</p>
                                        </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-20">
                                    <Search size={48} className="mx-auto mb-4 opacity-50"/>
                                    <p>Search Users</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                )}
            </header>

            {filters && (
                <CreatePostDialog open={isDialogOpen} setIsDialogOpen={setIsDialogOpen} user_id={user_id}/>
            )}
        </>
    );

}


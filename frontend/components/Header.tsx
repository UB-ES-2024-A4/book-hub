"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import CreatePostButton from "@/components/CreatePostButton";
import { CreatePostDialog } from "@/components/dialog/CreatePostDialog";
import { Filter } from "@/app/types/Filter";
import { loadFilters, searchUsersHandler } from "@/app/actions";
import "nextjs-toast-notify/dist/nextjs-toast-notify.css";
import { toast } from "nextjs-toast-notify";
import { useFeed } from "@/contex/FeedContext";
import Dropdown from "./Dropdown";
import { Compass, Home, CirclePlus, Search, X } from 'lucide-react';
import Image from "next/image";
import { User } from "@/app/types/User";
import { errorMessage, getColorFromInitials } from "@/app/lib/hashHelpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type HeaderProps = {
  accessToken: string | null;
  user_id: number | undefined;
};

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

const baseUrl = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;

<style jsx global>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .smooth-appear {
    animation: fadeIn 0.3s ease-out forwards;
  }
`}</style>

export default function Header({ accessToken, user_id }: HeaderProps) {
  const { addAllFilters, filters, changeUrlImage } = useFeed();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pathname = usePathname();

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchStatus, setStatus] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openDialog = () => setIsDialogOpen(true);
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    setSearchValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleUserSelect = (user: User) => toggleSearch();

  const searchButtonHandler = async () => {
    if (searchValue.length < 3) {
      toast.info("Please enter at least 3 characters", {
        duration: 4000, progress: true, position: "top-left", transition: "swingInverted", sonido: true,
      });
      return;
    }
    setStatus(true);
    const response = await searchUsersHandler(searchValue);
    response.status === 200 ? setSearchResults(response.data) : errorMessage("Error searching users");
  };

  useEffect(() => {
    async function fetchFilters() {
      if (filters && Object.keys(filters).length > 0) return;
      const result = await loadFilters();
      if (result.status === 200) {
        const filtersObject = result.data.reduce((acc: { [key: number]: string }, filter) => {
          acc[filter.id] = filter.name;
          return acc;
        }, {});
        addAllFilters(filtersObject);
        changeUrlImage(`${baseUrl}/${user_id}.png?timestamp=${new Date().getTime()}`);
      }
    }
    fetchFilters();
  }, []);

  return (
    <>
      <header className="flex flex-col md:flex-row h-full">
        {/* Sidebar */}
        <div className={`bg-gradient-to-b from-[#051B32] to-[#0A2A50] shadow-lg shadow-blue-400/30 
          fixed top-0 left-0 flex flex-col md:h-screen transition-all duration-300 ease-in-out 
          ${isSearchActive ? 'w-20' : 'w-full md:w-52'} hover:shadow-xl hover:shadow-blue-500/20`}>

          <div className="container mx-auto flex justify-between items-center pl-4 pt-2 md:flex-col md:items-start">
            <Link href="/home" className="text-blue-400 text-2xl font-bold md:hidden relative overflow-hidden">
              <span className="hover:text-blue-300 transition-colors">BookHub</span>
              <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity"/>
            </Link>

            <button 
              className="md:hidden flex items-center text-gray-400 hover:bg-white/10 rounded-full p-1 transition-colors pr-4"
              onClick={toggleMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:rotate-90 transition-transform" 
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/>
              </svg>
            </button>
          </div>

          <nav className={`${isMenuOpen ? 'flex' : 'hidden'} h-full md:flex flex-col space-y-4 p-4 flex-grow`}>
            <div className="flex flex-col space-y-6">
              {!accessToken ? null : (
                <div className="flex gap-8 items-center text-white">
                  {menuItems.map((item) => (
                    <div key={item.title}><Dropdown item={item} user_id={user_id}/></div>
                  ))}
                </div>
              )}
              
              {accessToken && (
                <Link href="/home"
                      className={`group transition-colors duration-300 flex items-center space-x-2 
                        ${pathname === '/home' ? 'text-blue-400' : 'text-gray-300'}`}
                      onClick={() => setIsMenuOpen(false)}>
                  <Home size={24} className="group-hover:scale-125 transition-transform"/>
                  <span className={`${isSearchActive ? 'hidden' : 'block'} transition-all duration-400 
                    group-hover:underline underline-offset-4`}>Home</span>
                </Link>
              )}

              <Link href="/explorer"
                    className={`group transition-colors duration-300 flex items-center space-x-2 
                      ${pathname === '/explorer' ? 'text-blue-400' : 'text-gray-300'}`}
                    onClick={() => setIsMenuOpen(false)}>
                <Compass size={24} className="group-hover:scale-125 transition-transform"/>
                <span className={`${isSearchActive ? 'hidden' : 'block'} transition-all duration-400 
                  group-hover:underline underline-offset-4`}>Explorer</span>
              </Link>

              <button
                className={`group flex items-center space-x-2 focus:outline-none 
                  ${isSearchActive ? 'text-blue-400' : 'text-gray-300'}`}
                onClick={toggleSearch}>
                {isSearchActive ? (
                  <X size={24} className="group-hover:rotate-90 transition-transform"/>
                ) : (
                  <Search size={24} className="group-hover:scale-125 transition-transform"/>
                )}
                <span className={`${isSearchActive ? 'hidden' : 'block'} transition-all duration-400 
                  group-hover:underline underline-offset-4`}>Search</span>
              </button>

              {accessToken && (
                <div className="group transition-colors duration-300 flex items-center space-x-2 text-gray-300">
                  <CirclePlus size={24} className="group-hover:scale-125 transition-transform"/>
                  <span className={`${isSearchActive ? 'hidden' : 'block'} transition-all duration-400 
                    group-hover:underline underline-offset-4`}>
                    <CreatePostButton openDialog={openDialog}/>
                  </span>
                </div>
              )}
            </div>
          </nav>

          <div className={`p-4 mt-auto text-left md:text-left ${isSearchActive ? 'hidden' : 'block'}`}>
            <Link href="/home" className="text-blue-400 text-2xl font-bold hidden md:block lg:inline 
              hover:text-blue-300 transition-colors">
              BookHub
            </Link>
          </div>
        </div>

        {isSearchActive && (
          <div className="fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ease-in-out w-full h-full">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={toggleSearch}/>

            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#051B32] to-[#0A2A50] 
              shadow-lg shadow-blue-900/30 w-full max-w-md mx-auto mt-4 rounded-xl overflow-hidden 
              smooth-appear">
              
              <div className="p-4 bg-[#051B32]">
                <div className="relative input-focus-effect">
                  <h1 className="text-xl font-bold text-gray-200 pb-2">Search</h1>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search username or full name"
                      className="pl-10 pr-24 py-3 bg-gray-800/50 text-white rounded-xl border border-white/20 
                        focus:outline-none focus:border-blue-400/50 transition-colors w-full"
                      value={searchValue}
                      onChange={handleInputChange}
                      maxLength={28}
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && searchButtonHandler()}
                    />
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <button
                      className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 
                        text-white px-4 py-1.5 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:from-blue-600 
                        hover:to-purple-700 transition-all"
                      onClick={searchButtonHandler}>
                      Search
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-screen overflow-y-auto px-4 py-2 bg-[#051B32]">
                {searchStatus ? (
                  <div className="smooth-appear">
                    <h3 className="text-gray-400 mb-4 font-semibold">Search Results</h3>
                    <div className="space-y-3">
                      {searchResults.length > 0 ? (
                        searchResults.map((user) => (
                          user.id !== user_id && (
                            <Link key={user.id} href={user_id === user.id ? "/account" : `/profile?userId=${user.id}`}>
                              <div className="bg-gray-800/50 rounded-xl p-3 flex items-center hover:bg-gray-700/50 
                                transition-all cursor-pointer space-x-3 border border-transparent 
                                hover:border-blue-400/30 search-result-hover">
                                <Avatar className="w-10 h-10 border-2 border-blue-400 hover:scale-105 transition-transform">
                                  <AvatarImage src={`${baseUrl}/${user.id}.png`} />
                                  <AvatarFallback
                                    style={{ backgroundColor: getColorFromInitials(user.username?.substring(0, 2).toUpperCase() || "?") }}
                                    className="text-white font-semibold text-sm">
                                    {user.username?.substring(0, 2).toUpperCase() || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-white font-semibold">{user.username}</p>
                                  <p className="text-gray-400 text-sm">{user.first_name} {user.last_name}</p>
                                </div>
                              </div>
                            </Link>
                          )
                        ))
                      ) : (
                        <p className="text-gray-400 text-center py-4">No users found.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-20 smooth-appear">
                    <Search size={48} className="mx-auto mb-4 opacity-50 animate-pulse"/>
                    <p className="text-gray-400">Search Users</p>
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
"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import CreatePostButton from "@/components/CreatePostButton";
import { CreatePostDialog } from "@/components/dialog/CreatePostDialog";
import { loadFilters, searchUsersHandler } from "@/app/actions";
import "nextjs-toast-notify/dist/nextjs-toast-notify.css";
import { toast } from "nextjs-toast-notify";
import { useFeed } from "@/contex/FeedContext";
import Dropdown from "./Dropdown";
import { Compass, Home, CirclePlus, Search, X } from 'lucide-react';
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
      toast.info("Minimum 3 characters required", {
        duration: 4000, 
        style: { background: '#111', border: '1px solid #ff6b00', color: '#ff6b00' }
      });
      return;
    }
    setStatus(true);
    const response = await searchUsersHandler(searchValue);
    response.status === 200 ? setSearchResults(response.data) : errorMessage("Scan failed");
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
        <div className={`bg-[#0a0a0a] border-r border-[#ff6b0033] shadow-[0_0_30px_rgba(255,107,0,0.1)]
          fixed top-0 left-0 flex flex-col md:h-screen transition-all duration-300
          ${isSearchActive ? 'w-20' : 'w-full md:w-58'} group holographic-effect`}>

          <div className="container mx-auto flex justify-between items-center p-4 md:flex-col md:items-start">
            <Link href="/home" className="text-[#ff6b00] font-bold text-2xl md:text-3xl 
              hover:text-[#ff3300] transition-all duration-300 relative z-10">
              <span className="text-shadow-[0_0_15px_rgba(255,107,0,0.5)]">BookHub</span>
              <div className="absolute inset-0 bg-[#ff6b00] opacity-0 group-hover:opacity-10 transition-opacity rounded-full blur-md"/>
            </Link>

            <button 
              className="md:hidden text-[#ff6b00] hover:text-[#ff3300] transition-colors z-10"
              onClick={toggleMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" 
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" className="stroke-[#ff6b00]"/>
              </svg>
            </button>
          </div>

          <nav className={`${isMenuOpen ? 'flex' : 'hidden'} h-full md:flex flex-col space-y-6 p-4`}>
            <div className="flex flex-col space-y-8">
              {!accessToken ? null : (
                <div className="cyber-border rounded-lg">
                  <div className="bg-[#1a1a1a] rounded-lg p-2">
                    {menuItems.map((item) => (
                      <div key={item.title}><Dropdown item={item} user_id={user_id}/></div>
                    ))}
                  </div>
                </div>
              )}
              
              {accessToken && (
                <Link href="/home"
                      className={`flex items-center space-x-3 p-3 rounded-lg
                        ${pathname === '/home' ? 'bg-[#ff6b0022]' : 'hover:bg-[#ff6b0011]'}
                        transition-all duration-300 relative group`}>
                  <div className="absolute left-0 w-1 h-full bg-[#ff6b00] opacity-0 group-hover:opacity-100 transition-opacity rounded-r"/>
                  <Home className="text-[#ff6b00] w-6 h-6 group-hover:scale-125 transition-transform"/>
                  <span className="text-[#ff9e66] text-lg font-medium">Home</span>
                </Link>
              )}

              <Link href="/explorer"
                    className={`flex items-center space-x-3 p-3 rounded-lg
                      ${pathname === '/explorer' ? 'bg-[#ff6b0022]' : 'hover:bg-[#ff6b0011]'}
                      transition-all duration-300 relative group`}>
                <div className="absolute left-0 w-1 h-full bg-[#ff6b00] opacity-0 group-hover:opacity-100 transition-opacity rounded-r"/>
                <Compass className="text-[#ff6b00] w-6 h-6 hover:animate-neonPulse"/>
                <span className="text-[#ff9e66] text-lg font-medium">Explorer</span>
              </Link>

              <button
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#ff6b0011]
                  transition-all duration-300 group relative"
                onClick={toggleSearch}>
                <div className="absolute left-0 w-1 h-full bg-[#ff6b00] opacity-0 group-hover:opacity-100 transition-opacity rounded-r"/>
                {isSearchActive ? (
                  <X className="text-[#ff6b00] w-6 h-6 group-hover:rotate-90 transition-transform"/>
                ) : (
                  <Search className="text-[#ff6b00] w-6 h-6 group-hover:scale-125 transition-transform"/>
                )}
                <span className="text-[#ff9e66] text-lg font-medium">Scan</span>
              </button>

              {accessToken && (
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#ff6b0011]
                  transition-all duration-300 relative group">
                  <div className="absolute left-0 w-1 h-full bg-[#ff6b00] opacity-0 group-hover:opacity-100 transition-opacity rounded-r"/>
                  <CirclePlus className="text-[#ff6b00] w-6 h-6 hover:animate-neonPulse"/>
                  <span className="text-[#ff9e66] text-lg font-medium">
                    <CreatePostButton openDialog={openDialog}/>
                  </span>
                </div>
              )}
            </div>
          </nav>
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
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "nextjs-toast-notify";

import { useFeed } from "@/contex/FeedContext";
import CreatePostButton from "@/components/CreatePostButton";
import { CreatePostDialog } from "@/components/dialog/CreatePostDialog";
import { loadFilters, searchUsersHandler } from "@/app/actions";
import { Filter } from "@/app/types/Filter";
import "nextjs-toast-notify/dist/nextjs-toast-notify.css";

import { errorMessage, getColorFromInitials } from "@/app/lib/hashHelpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import LinkComp from "next/link";
import { User } from "@/app/types/User";
import SidebarContainer from "@/app/home/components/SidebarContainer";

// Import our new separate SidebarContainer

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
        route: "/sign-in",
      },
    ],
  },
];

const baseUrl = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;

export default function Header({ accessToken, user_id }: HeaderProps) {
  const { addAllFilters, filters, changeUrlImage } = useFeed();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchStatus, setSearchStatus] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const pathname = usePathname();

  // Toggle the mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  // Toggle the search overlay
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    setSearchValue("");
  };
  // Open create post dialog
  const openDialog = () => setIsDialogOpen(true);

  // Input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Search
  const searchButtonHandler = async () => {
    if (searchValue.length < 3) {
      toast.info("Please enter at least 3 characters", {
        duration: 4000,
      });
      return;
    }
    setSearchStatus(true);
    const response = await searchUsersHandler(searchValue);
    if (response.status === 200) {
      setSearchResults(response.data);
    } else {
      errorMessage("There was an error searching for users");
    }
  };

  const handleUserSelect = () => {
    toggleSearch();
  };

  // Load filters on mount
  useEffect(() => {
    async function fetchFilters() {
      if (filters && Object.keys(filters).length > 0) return;
      const result = await loadFilters();
      if (result.status !== 200) {
        toast.error(result.message);
        return;
      }
      const loadedFilters: Filter[] = result.data;
      const filtersObject: { [key: number]: string } = {};
      loadedFilters.forEach((f) => (filtersObject[f.id] = f.name));
      addAllFilters(filtersObject);

      // Update user profile image
      changeUrlImage(baseUrl + `/${user_id}.png?timestamp=${Date.now()}`);
    }
    fetchFilters();
  }, [filters, addAllFilters, changeUrlImage, user_id]);

  return (
    <>
      {/* The new standalone sidebar */}
      <SidebarContainer
        accessToken={accessToken}
        user_id={user_id}
        isMenuOpen={isMenuOpen}
        isSearchActive={isSearchActive}
        toggleMenu={toggleMenu}
        toggleSearch={toggleSearch}
        openDialog={openDialog}
        menuItems={menuItems}
        pathname={pathname}
      />

      {/* The search overlay, create post dialog, etc. remain here */}
      {isSearchActive && (
        <div className={`fixed top-0 left-0 right-0 z-[9999] w-full h-full`}>
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={toggleSearch}
          />
          <div className="absolute top-0 left-0 right-0 bg-[#051B32] 
              shadow-lg shadow-blue-900/50 w-full max-w-md mx-auto mt-4 rounded-xl overflow-hidden">
            <div className="p-4 bg-[#051B32]">
              <h1 className="text-xl font-bold text-gray-200 pb-2">Search</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search username or full name"
                  className="pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500 w-full"
                  value={searchValue}
                  onChange={handleInputChange}
                  maxLength={28}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchButtonHandler();
                    }
                  }}
                />
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <button
                  className="absolute top-2 right-2 text-gray-400 bg-white/20
                    hover:bg-blue-700/20 rounded-lg px-4 py-1 text-sm"
                  onClick={searchButtonHandler}
                >
                  Search
                </button>
              </div>
            </div>

            <div className="h-screen overflow-y-auto px-4 py-2 bg-[#051B32]">
              {searchStatus ? (
                <div>
                  <h3 className="text-gray-400 mb-4 font-semibold">Search Results</h3>
                  <div className="space-y-3">
                    {searchResults.length > 0 ? (
                      searchResults.map((user) => (
                        user.id !== user_id && (
                          <LinkComp
                            key={user.id}
                            href={user_id === user.id ? "/account" : `/profile?userId=${user.id}`}
                          >
                            <div
                              className="bg-gray-800 rounded-lg p-3 flex items-center hover:bg-gray-700
                                transition-colors cursor-pointer space-x-3"
                              onClick={handleUserSelect}
                            >
                              <Avatar className="w-10 h-10 border-2 border-blue-400">
                                <AvatarImage src={`${baseUrl}/${user.id}.png`} />
                                <AvatarFallback
                                  style={{
                                    backgroundColor: user.username
                                      ? getColorFromInitials(user.username.substring(0, 2).toUpperCase())
                                      : "hsl(215, 100%, 50%)",
                                  }}
                                  className="text-white font-semibold text-sm flex items-center justify-center"
                                >
                                  {user.username
                                    ? user.username.substring(0, 2).toUpperCase()
                                    : "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-white font-semibold">{user.username}</p>
                                <p className="text-gray-400 text-sm">
                                  {user.first_name} {user.last_name}
                                </p>
                              </div>
                            </div>
                          </LinkComp>
                        )
                      ))
                    ) : (
                      <p className="text-gray-400 text-center">No users found.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-20">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Search Users</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {filters && (
        <CreatePostDialog
          open={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          user_id={user_id}
        />
      )}
    </>
  );
}

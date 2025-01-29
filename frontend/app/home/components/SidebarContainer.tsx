"use client";

import React from "react";
import Link from "next/link";
import { Home, Compass, Search, CirclePlus, X } from "lucide-react";

// shadcn/ui sidebar imports
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import CreatePostButton from "@/components/CreatePostButton";
import Dropdown from "@/components/Dropdown";

type MenuChild = {
  title: string;
  route?: string;
};

type MenuItem = {
  title: string;
  route?: string;
  children?: MenuChild[];
};

type SidebarProps = {
  // Auth
  accessToken: string | null;
  user_id: number | undefined;

  // States from Header
  isMenuOpen: boolean;
  isSearchActive: boolean;

  // Handlers from Header
  toggleMenu: () => void;
  toggleSearch: () => void;
  openDialog: () => void;

  // Navigation info
  menuItems: MenuItem[];
  pathname: string;
};

export default function SidebarContainer({
  accessToken,
  user_id,
  isMenuOpen,
  isSearchActive,
  toggleMenu,
  toggleSearch,
  openDialog,
  menuItems,
  pathname,
}: SidebarProps) {
  return (
    <Sidebar
      className={`
        bg-[#0a0a0a]
        border-r border-[#ff6b0033]
        shadow-[0_0_30px_rgba(255,107,0,0.1)]
        flex flex-col
      `}
    >
      <SidebarContent className="flex flex-col space-y-6 p-4 flex-grow">
        {accessToken && (
          <div className="cyber-border rounded-lg">
            <div className="bg-[#1a1a1a] rounded-lg p-2">
              {menuItems.map((item) => (
                <Dropdown key={item.title} item={item} user_id={user_id} />
              ))}
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* HOME LINK */}
              {accessToken && (
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-12" asChild>
                    <Link
                      href="/home"
                      className={`flex items-center space-x-3 p-3 rounded-lg
                        ${pathname === "/home" ? "bg-[#ff6b0022]" : "hover:bg-[#ff6b0011]"}
                        transition-all duration-300 relative group
                        ${isSearchActive ? "text-blue-600" : "text-gray-300"}
                      `}
                      onClick={toggleMenu}
                    >
                      {/* Orange bar on hover */}
                      <div className="absolute left-0 w-1 h-full bg-[#ff6b00] opacity-0 group-hover:opacity-100 transition-opacity rounded-r" />
                      <Home className="text-[#ff6b00] w-6 h-6 group-hover:scale-125 transition-transform" />
                      <span className="text-[#ff9e66] text-lg font-medium">Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* EXPLORER LINK */}
              <SidebarMenuItem>
              <SidebarMenuButton className="h-12" asChild>
              <Link
                    href="/explorer"
                    className={`flex items-center space-x-3 p-3 rounded-lg
                      ${pathname === "/explorer" ? "bg-[#ff6b0022]" : "hover:bg-[#ff6b0011]"}
                      transition-all duration-300 relative group
                      text-gray-300
                    `}
                    onClick={toggleMenu}
                  >
                    <div className="absolute left-0 w-1 h-full bg-[#ff6b00] opacity-0 group-hover:opacity-100 transition-opacity rounded-r" />
                    <Compass className="text-[#ff6b00] w-6 h-6 hover:animate-neonPulse" />
                    <span className="text-[#ff9e66] text-lg font-medium">Explorer</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* SEARCH / SCAN BUTTON */}
              <SidebarMenuItem>
              <SidebarMenuButton className="h-12" asChild>
              <button
                    className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-[#ff6b0011]
                      transition-all duration-300 group relative
                      ${isSearchActive ? "text-blue-600" : "text-gray-300"}
                    `}
                    onClick={toggleSearch}
                  >
                    <div className="absolute left-0 w-1 h-full bg-[#ff6b00] opacity-0 group-hover:opacity-100 transition-opacity rounded-r" />
                    {isSearchActive ? (
                      <X className="text-[#ff6b00] w-6 h-6 group-hover:rotate-90 transition-transform" />
                    ) : (
                      <Search className="text-[#ff6b00] w-6 h-6 group-hover:scale-125 transition-transform" />
                    )}
                    <span className="text-[#ff9e66] text-lg font-medium">
                      Scan
                    </span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* CREATE POST BUTTON */}
              {accessToken && (
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-12" asChild>
                  <div
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#ff6b0011]
                                 transition-all duration-300 relative group text-gray-300"
                    >
                      <div className="absolute left-0 w-1 h-full bg-[#ff6b00] opacity-0 group-hover:opacity-100 transition-opacity rounded-r" />
                      <CirclePlus className="text-[#ff6b00] w-6 h-6 hover:animate-neonPulse" />
                      <span className="text-[#ff9e66] text-lg font-medium">
                        <CreatePostButton openDialog={openDialog} />
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* BOTTOM BRAND LINK ON DESKTOP (like your second snippet) */}
      <div
        className={`
          p-4 mt-auto text-left md:text-left
          ${isSearchActive ? "hidden" : "block"}
        `}
      >
        <Link
          href="/home"
          className="text-[#ff6b00] font-bold text-2xl hidden md:block lg:inline
            hover:text-[#ff3300] transition-all duration-300 relative z-10"
        >
          <span className="text-shadow-[0_0_15px_rgba(255,107,0,0.5)]">BookHub</span>
          <div className="absolute inset-0 bg-[#ff6b00] opacity-0 group-hover:opacity-10 transition-opacity rounded-full blur-md" />
        </Link>
      </div>
    </Sidebar>
  );
}

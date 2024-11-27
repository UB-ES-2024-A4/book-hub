"use client";

import React, {useEffect, useState} from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import CreatePostButton from "@/components/CreatePostButton";
import {CreatePostDialog} from "@/components/Dialog/CreatePostDialog";
import {Filter} from "@/app/types/Filter";
import {fetchUser, loadFilters} from "@/app/actions";
import "nextjs-toast-notify/dist/nextjs-toast-notify.css";
import {toast} from "nextjs-toast-notify";
import Dropdown from "./Dropdown";


type HeaderProps = {
    accessToken: string | null;
    user_id: number;
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
          route: '/auth/sign-in'
        },
      ],
    },
  ];

export default function Header({accessToken, user_id}: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState<Filter[] | null>(null);

    const pathname = usePathname(); // Obtener la ruta actual

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const openDialog = () => {
        setIsDialogOpen(true);
    };

   useEffect(() => {
       console.log("SE EJECUTA FILTROS 1");
        // Load filters if they are not loaded then Fetch Error
        async function fetchFilters() {
            const result = await loadFilters();

            console.log("Filters IN THE HEADER", result.data);

            if (result.status !== 200) {
                toast.error(" Could not connect to the server !", {
                    duration: 4000,
                    progress: true,
                    position: "top-left",
                    transition: "swingInverted",
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
                    sonido: true,
                  });
                return;
            }else {
                setFilters(result.data);
            }
        }

        fetchFilters();
    }, []);

return (
    <>
        <header className="bg-gray-100 shadow-md fixed top-0 left-0 right-0 z-10">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link href="/home" className="text-[#4066cf] text-2xl font-bold">BookHub</Link>
                <nav className="hidden md:flex space-x-8 items-center">
                    <Link href="/home" className={`path transition-colors duration-300 ${pathname === '/home' ? 'text-blue-600' : 'text-gray-600'}`}>Home</Link>
                    <Link href="/explorer" className={`path transition-colors duration-300 ${pathname === '/explorer' ? 'text-blue-600' : 'text-gray-600'}`}>Explorer</Link>
                    {!accessToken ? null : ( <CreatePostButton openDialog={openDialog}/> )}
                    {!accessToken ? null : ( <div className="flex gap-8 items-center text-white">
                        {menuItems.map((item) => {
                            <div key={item.title}></div>
                        return <div key={item.title}> <Dropdown item={item} user_id={user_id} /></div>
                        })}
                    </div> )}
                </nav>
                <button className="md:hidden flex items-center text-gray-600 focus:outline-none" onClick={toggleMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/>
                    </svg>
                </button>
            </div>

            {isMenuOpen && (
                <nav className="bg-white md:hidden">
                    <ul className="space-y-2 p-4">
                        {!accessToken ? null : ( <div className="flex gap-8 items-center text-white">
                            {menuItems.map((item) => {
                            return <div key={item.title}> <Dropdown item={item} user_id={user_id} /></div>
                            })}
                        </div> )}
                        <li><Link href="/home"
                                  className={`path block transition-colors duration-300 ${pathname === '/home' ? 'text-blue-600' : 'text-gray-600'}`}
                                  onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                        <li><Link href="/explorer"
                                  className={`path block transition-colors duration-300 ${pathname === '/explorer' ? 'text-blue-600' : 'text-gray-600'}`}
                                  onClick={() => setIsMenuOpen(false)}>Explorer</Link></li>
                        <li>
                            {!accessToken ? null : (<CreatePostButton openDialog={openDialog}/>)}
                        </li>
                        <li><Link href="/account"
                                  className={`path block transition-colors duration-300 ${pathname === '/account' ? 'text-blue-600' : 'text-gray-600'}`}
                                  onClick={() => setIsMenuOpen(false)}>Account</Link></li>
                        <li><Link href="/auth/sign-in"
                                  className="path block text-white bg-[#4066cf] px-4 py-2 rounded-md shadow-md transition duration-300 hover:bg-[#3050a6]"
                                  onClick={() => setIsMenuOpen(false)}>Sign In</Link></li>
                        <li><Link href="/auth/sign-up"
                                  className="path block text-white bg-green-500 px-4 py-2 rounded-md shadow-md transition duration-300 hover:bg-green-600"
                                  onClick={() => setIsMenuOpen(false)}>Sign Up</Link></li>
                    </ul>
                </nav>
            )}
        </header>
        {filters ? <CreatePostDialog open={isDialogOpen} setIsDialogOpen={setIsDialogOpen} filters={filters} user_id={user_id}/> : null }
    </>
);
}
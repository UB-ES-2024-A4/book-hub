"use client";

import React, { useState } from 'react';
import Link from "next/link";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link href="/frontend/public" className="text-[#4066cf] text-2xl font-bold">BookHub</Link>
                <nav className="hidden md:flex space-x-8 items-center">
                    <Link href="/home" className="path text-gray-600 transition-colors duration-300">Home</Link>
                    <Link href="/explorer" className="path text-gray-600 transition-colors duration-300">Explorer</Link>
                    <Link href="/account" className="path text-gray-600 transition-colors duration-300">Account</Link>
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
                        <li><Link href="/frontend/public" className="path block text-gray-600 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                        <li><Link href="/explorer" className="path block text-gray-600 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Explorer</Link></li>
                        <li><Link href="/account" className="path block text-gray-600 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Account</Link></li>
                        <li><Link href="/auth/sign-in" className="path block text-white bg-[#4066cf] px-4 py-2 rounded-md shadow-md transition duration-300 hover:bg-[#3050a6]" onClick={() => setIsMenuOpen(false)}>Sign In</Link></li>
                        <li><Link href="/auth/sign-up" className="path block text-white bg-green-500 px-4 py-2 rounded-md shadow-md transition duration-300 hover:bg-green-600" onClick={() => setIsMenuOpen(false)}>Sign Up</Link></li>
                    </ul>
                </nav>
            )}
        </header>
    );
}

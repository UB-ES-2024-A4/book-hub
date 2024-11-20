"use server";

import { cookies } from 'next/headers';
import Link from "next/link";
import React from "react";

const LinksButtons = async () => {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    console.log("Access Token:", accessToken);

    return (
        <div className="mt-6 flex space-x-4">
            {!accessToken ? (
                <>
                    <Link
                        href="/auth/sign-in"
                        className="text-white bg-[#4066cf] px-4 py-2 rounded-md shadow-md transition duration-300 hover:bg-[#3050a6]"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/auth/sign-up"
                        className="text-white bg-green-500 px-4 py-2 rounded-md shadow-md transition duration-300 hover:bg-green-600"
                    >
                        Sign Up
                    </Link>
                </>
            ) : null}
        </div>
    );
}

export default LinksButtons;

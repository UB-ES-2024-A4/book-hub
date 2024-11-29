"use client";
import { Lock, User2 } from "lucide-react";
import InputAuth from "../InputAuth";
import { Button } from '@/components/ui/button';
import { SignInValidation} from "@/app/lib/authentication";
import { useFormState  } from 'react-dom';
import {SubmissionResult, useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {signInSchema} from "@/app/lib/zodSchemas";
import Link from "next/link";
import Image from "next/image";
import {toast} from "nextjs-toast-notify";
import "nextjs-toast-notify/dist/nextjs-toast-notify.css";
import {redirect} from "next/navigation";

export default function SignInForm() {
    // Using useFormState hook to manage form state and validation
     const [lastResult, action] = useFormState(async (prevState: unknown, formData: FormData) => {
        const result = await SignInValidation(prevState, formData);
        console.log("MESSAGE FRON SIGN IN", result.status);
        if( result.status !== 200 ) {
            toast.warning(result.message, {
                duration: 4000, progress: true, position: "top-right", transition: "swingInverted",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"> ' +
                    '<g fill="none" stroke="#FF4500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ' +
                    '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/> <path d="M12 9v4M12 17h.01"/> </g> </svg>',
                sonido: true,
            });
        }
        else{
            console.log("SUCCESS, REDIRECTING TO HOME");
            redirect('/home');
        }

        const submission: SubmissionResult = {status: "success",}


        return submission;
    }, undefined);

    // Using useForm hook to manage form state and validation
    const [form, fields] = useForm({
        lastResult, // Passes the last result from the action state to the form
        onValidate({ formData }) {
            // Parses and validates the form data using the Zod schema
            return parseWithZod(formData, { schema: signInSchema });
        },
        shouldValidate: "onBlur", // Validate when an input loses focus
        shouldRevalidate: "onInput", // Revalidate when the user inputs or modifies the form
    });


    return (
        <div className="w-full h-full  flex flex-col justify-center md:py12 py-4">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Image src="/logo.png" alt="Book Image" width={50} height={50} />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-500">
                    Sign In
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500">
                    Please log in to discover and explore your next favorite read
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#1D2B5A] py-6 px-6 shadow rounded-lg ">
                    <form className="space-y-6"
                        id={form.id}
                        onSubmit={form.onSubmit}
                        action={action}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email or Username
                            </label>
                            <div className="mt-1">
                                <InputAuth
                                    key={fields.user.key}
                                    name={fields.user.name}
                                    defaultValue={fields.user.initialValue}
                                    id="user"
                                    type="text"
                                    icon={User2}
                                    placeholder="zoro3@gmail.com"
                                />
                            </div>
                            <p className="pt-2 text-red-500 text-sm"
                            >{fields.user.errors}</p>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <InputAuth
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    icon={Lock}
                                />
                            </div>
                            <p className="pt-2 text-red-500 text-sm"
                            >{fields.password.errors}</p>
                        </div>
                        <div>
                            <Button type="submit"
                                    className="w-full px-4 py-2 bg-gradient-to-br from-blue-500 via-gray-400 to-blue-400
                                    text-white rounded-md border-2 duration-300 transition-all
                                    border-gray-300 hover:bg-gradient-to-br
                                    hover:from-blue-600 hover:via-gray-500 hover:to-blue-500
                                    hover:scale-105 hover:shadow-lg font-medium"
                                >
                                Sign In
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 pb-3">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#3B4C79] text-gray-400 rounded-lg">
                            You don&#39;t have an account?
                        </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link type="button"
                                    className="w-full bg-[#3B4C79] rounded-lg shadow-md transition text-sm
                                    duration-300 inline-block text-white hover:bg-gray-800 text-center py-2 px-4 "
                                    href="/sign-up">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
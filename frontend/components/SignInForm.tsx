"use client";
import { Lock, Mail, User, LibraryBig } from "lucide-react";
import Input from "./Input";
import { Button } from '@/components/ui/button';
import { CreateUser, SignIn } from "@/app/actions";
import { useFormState  } from 'react-dom';
import {useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {signInSchema} from "@/app/lib/zodSchemas";
import Link from "next/link";

export default function SignInForm() {
    // Using useActionState hook to manage the state of CreateUser action
    const [lastResult, action] = useFormState(SignIn, undefined);

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
                    <LibraryBig className="h-12 w-12 text-blue-500"/>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
                    Sign In
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Please log in to discover and explore your next favorite read
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#1D2B5A] py-8 px-6 shadow rounded-lg ">
                    <form className="space-y-6"
                        id={form.id}
                        onSubmit={form.onSubmit}
                        action={action}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <Input
                                    key={fields.email.key}
                                    name={fields.email.name}
                                    defaultValue={fields.email.initialValue}
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    icon={Mail}
                                    placeholder="zoro3@gmail.com"
                                />
                            </div>
                            <p className="pt-2 text-red-500 text-sm"
                            >{fields.email.errors}</p>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <Input
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
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md border-2
                                    border-gray-300 hover:bg-blue-600
                                        ">
                                Sign In
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#3B4C79] text-gray-400 rounded-lg">
                            You don't have an account?
                        </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link type="button"
                                    className="w-full inline-flex justify-center py-2 px-4 border-2
                                    border-gray-500 rounded-md shadow-sm bg-[#3B4C79] text-sm font-medium
                                    text-white hover:bg-gray-600 "
                                    href="/auth/sign-up">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
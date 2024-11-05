"use client";
import { Lock, Mail, User } from "lucide-react";
import InputAuth from "./InputAuth";
import { Button } from '@/components/ui/button';
import { CreateUser } from "@/app/lib/authentication";
import { useForm } from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {signUpSchema} from "@/app/lib/zodSchemas";
import Link from "next/link";
import { useFormState } from "react-dom";
import Image from "next/image"

export default function SignUpForm() {
    // Using useActionState hook to manage the state of CreateUser action
    const [lastResult, action] = useFormState(CreateUser, undefined);

    // Using useForm hook to manage form state and validation
    const [form, fields] = useForm({
        lastResult, // Passes the last result from the action state to the form
        onValidate({ formData }) {
            // Parses and validates the form data using the Zod schema
            return parseWithZod(formData, { schema: signUpSchema });
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
                            Join BookHub
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-500">
                            Your personal book community awaits!
                        </p>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-[#1D2B5A] pt-8 pb-4 px-6 shadow rounded-lg ">
                            <form className="space-y-6"
                                  id={form.id}
                                  onSubmit={form.onSubmit}
                                  action={action}>
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                        Username
                                    </label>
                                    <div className="mt-1">
                                        <InputAuth
                                            key={fields.username.key}
                                            name={fields.username.name}
                                            defaultValue={fields.username.initialValue}
                                            id="username"
                                            type="text"
                                            icon={User}
                                            placeholder="Zoro3_Op"
                                        />
                                    </div>
                                    <p className="pt-2 text-red-500 text-sm"
                                    >{fields.username.errors}</p>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between">
                                    <div>
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-300">
                                            First name
                                        </label>
                                        <div className="mt-1 mr-1">
                                            <InputAuth
                                                key={fields.first_name.key}
                                                name={fields.first_name.name}
                                                defaultValue={fields.first_name.initialValue}
                                                id="username" type="text" icon={User}
                                                placeholder="Zoro"
                                            />
                                        </div>
                                        <p className="pt-2 text-red-500 text-sm"
                                        >{fields.first_name.errors}</p>
                                    </div>

                                    <div>
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-300">
                                            Last name
                                        </label>
                                        <div className="mt-1">
                                            <InputAuth
                                                key={fields.last_name.key}
                                                name={fields.last_name.name}
                                                defaultValue={fields.last_name.initialValue}
                                                id="username" type="text" icon={User}
                                                placeholder="Roronoa"
                                            />
                                        </div>
                                        <p className="pt-2 text-red-500 text-sm"
                                        >{fields.last_name.errors}</p>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <InputAuth
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
                                            className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-md border-2
                                            border-gray-300 hover:bg-blue-600
                                             ">
                                        Sign up
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
                                    Already have an account?
                                </span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Link type="button"
                                          className="w-full inline-flex justify-center py-2 px-4 border-2
                                           border-gray-500 rounded-md shadow-sm bg-[#3B4C79] text-sm font-medium
                                           text-white hover:bg-gray-600 "
                                          href="/auth/sign-in">
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>
    );
}
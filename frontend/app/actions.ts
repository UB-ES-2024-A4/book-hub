"use server";

// Importing necessary functions from Next.js and other libraries
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { signInSchema, signUpSchema } from "@/app/lib/zodSchemas";

// Async function to handle user creation
export async function CreateUser(prevState: unknown, formData: FormData) {
    // Parse the form data using Zod validation schema
    const submission = parseWithZod(formData, {
        schema: signUpSchema,
    });

    // If the validation fails, return the submission reply (with errors)
    if (submission.status !== "success") {
        return submission.reply();
    }

    // If validation is successful, redirect the user to the login page
    return redirect("/sign-up");
}

// Async function to handle user sign in
export async function SignIn(prevState: unknown, formData: FormData) {
    // Parse the form data using Zod validation schema
    const submission = parseWithZod(formData, {
        schema: signInSchema,
    });

    // If the validation fails, return the submission reply (with errors)
    if (submission.status !== "success") {
        return submission.reply();
    }

    // If validation is successful, redirect the user to the login page
    return redirect("/sign-in");
}

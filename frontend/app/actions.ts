"use server";

// Importing necessary functions from Next.js and other libraries
import { parseWithZod } from "@conform-to/zod";
import { signInSchema, signUpSchema } from "@/app/lib/zodSchemas";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";


export async function CreateUser(prevState: unknown, formData: FormData) {
    // Validate form data with Zod
    const submission = parseWithZod(formData, { schema: signUpSchema });

    // Handle validation errors if present
    if (submission.status !== "success") {
        return submission.reply();
    }
    let redirectPath: string | null = null

    try {
        // Convert formData to JSON
        const data = Object.fromEntries(formData);
        const response = await fetch('http://localhost:8000/users/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        
        // Handle the backend's response
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || "Registration failed");
        }

        redirectPath = '/auth/sign-in'; // Redirect upon successful registration
        
    } catch (error) {
        console.error("Error:", error);
        
    } finally {
        if (redirectPath) {
            redirect(redirectPath)
        }
    }
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
    let redirectPath: string | null = null

    try {
        // Convert formData to URLSearchParams for application/x-www-form-urlencoded format
        const data = new URLSearchParams();
        data.append("username", formData.get("email"));
        data.append("password", formData.get("password"));
        
        const response = await fetch('http://localhost:8000/login/access-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString(),  // Use URL-encoded string
        });
        
        // Handle the backend's response
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || "LogIn failed");
        }

        const responseData = await response.json();
        const { access_token, token_type } = responseData;

        // Set the access token in an HTTP-only cookie
        cookies().set({
            name: 'accessToken',
            value: access_token,
            httpOnly: true, // Ensures the cookie is only accessible by the server
            secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });
        
        // Redirect upon successful logIn
        redirectPath = '/home';

    } catch (error) {
        console.error("Error:", error);
        //return submission.reply();
        //return { error: "Registration failed" };
    } finally {
        if (redirectPath) {
            redirect(redirectPath)
        }
    }

}

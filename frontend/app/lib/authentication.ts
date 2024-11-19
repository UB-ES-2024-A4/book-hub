"use server";

// Importing necessary functions from Next.js and other libraries
import { parseWithZod } from "@conform-to/zod";
import {signInSchema, signUpSchema, userInformationSchema} from "@/app/lib/zodSchemas";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {User} from "@/app/types/User";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;


export async function CreateUser(prevState: unknown, formData: FormData) {
    // Validate form data with Zod
    const submission = parseWithZod(formData, { schema: signUpSchema });

    // Handle validation errors if present
    if (submission.status !== "success") {
        return submission.reply();
    }

    console.log(submission);
    console.log(formData);

    let redirectPath: string | null = null

    try {
        // Convert formData to JSON
        const data = Object.fromEntries(formData);
        const response = await fetch(baseUrl + '/users/', {
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
export async function SignInValidation(prevState: unknown, formData: FormData) {
    // Parse the form data using Zod validation schema
    const submission = parseWithZod(formData, {
        schema: signInSchema,
    });

    // If the validation fails, return the submission reply (with errors)
    if (submission.status !== "success") {
        return submission.reply();
    }

    // Convert formData to URLSearchParams for application/x-www-form-urlencoded format
    const data = new URLSearchParams();
    data.append("username", formData.get("user") as string);
    data.append("password", formData.get("password") as string);

    const response = await fetch(baseUrl + '/users/login/access-token', {
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
    console.log("Response data:", responseData);
    const {access_token, user, token_type} = responseData;

    console.log("User data:", user);

    // Set the access token in an HTTP-only cookie
    cookies().set({
        name: 'accessToken',
        value: access_token,
        httpOnly: true, // Ensures the cookie is only accessible by the server
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    user.biography = "Add your biography here";

    cookies().set({
        name: 'user',
        value: JSON.stringify(user),
        httpOnly: true, // Ensures the cookie is only accessible by the server
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    redirect('/home');

}

export async function getSession(): Promise<User | null> {
    // Get the access token from the cookie
    const session = cookies().get('user')?.value;
    if(!session) return null;

    // Convert the JSON string to an object
    const user = JSON.parse(session);
    return  user;
}

export async function getAccessToken(): Promise<string | null> {
    // Get the access token from the cookie
    const token = cookies().get('accessToken')?.value;
    if(!token) return null;
    return token;
}

export async function signOut() {
    // Clear the access token and user cookies upon sign out
    cookies().set("accessToken", "", { maxAge: 0,  });
    cookies().set("user", "", { maxAge: 0,  });
    redirect('/auth/sign-in');
}
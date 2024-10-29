"use server";

// Importing necessary functions from Next.js and other libraries
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { signInSchema, signUpSchema } from "@/app/lib/zodSchemas";
import React from "react";

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


// Async function to fetch the user's profile picture
export async function fetchProfilePictureA(userId: number): Promise<string> {
  const response = await fetch(`http://127.0.0.1:8000/users/pfp/${userId}`);
  if (response.ok) {
    return `http://127.0.0.1:8000/users/pfp/${userId}?${new Date().getTime()}`;
  } else {
    return "/book.jpg"; // Default image
  }
}


export async function putProfilePictureBackend(formData: FormData, userId: number) {
   try {
        const response = await fetch(`http://127.0.0.1:8000/users/pfp/${userId}`, {
          method: 'PUT',
          body: formData,
        });

        if (response.ok) {
          await fetchProfilePictureA(userId);
        } else {
          console.error("Error uploading the profile picture");
        }
      } catch (error) {
        console.error("Failed to upload the image", error);
      }
}

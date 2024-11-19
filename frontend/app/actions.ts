"use server";

// Importing necessary functions from Next.js and other libraries
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {User} from "@/app/types/User";
import { Post } from "@/app/types/Post";
import { BaseNextRequest } from "next/dist/server/base-http";
import { parseWithZod } from "@conform-to/zod";
import { getSession } from "./lib/authentication";
import { userInformationSchema } from "./lib/zodSchemas";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;
const NEXT_PUBLIC_AZURE_SAS_STORAGE = process.env.NEXT_PUBLIC_AZURE_SAS_STORAGE;
import {createPostSchema} from "@/app/lib/zodSchemas";

// Function to update the user's information
export async function UpdateUser(prevState: unknown, formData: FormData) {

    // Validate the form data using Zod
    const submission = parseWithZod(formData, { schema: userInformationSchema });

    // Handle validation errors if present
    if (submission.status !== "success") {
        return { message: "Do not pass the validation" };
    }

    const userCookie = await getSession();
    if(!userCookie) return;

    // Convert formData to URLSearchParams for application/x-www-form-urlencoded format
    const data = new URLSearchParams();
    data.append("id", userCookie.id.toString());
    if(formData.get("username"))
        data.append("username", formData.get("username") as string);
    if(formData.get("first_name"))
        data.append("first_name", formData.get("first_name") as string);
    if(formData.get("last_name"))
        data.append("last_name", formData.get("last_name") as string);
    if(formData.get("biography"))
        data.append("biography", formData.get("biography") as string);

    // Update the user's information
    const user = Object.fromEntries(data.entries());
    console.log("User New DATA INFORMATION", user);
    if(!user) return;

    try {
        // Convert formData to JSON and verify the user with the access token
        const data = Object.fromEntries(formData);
        const accessToken = cookies().get('accessToken')?.value;

        await fetch(baseUrl + `/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data),
        }).then(async (response) => {

                if (response.status == 400) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail);
                }
            }
        );

    } catch (error: any) {
        return { message: error.message };
    }

    // Update the user's information in the cookie
    cookies().set('user', JSON.stringify(user));
    return { message: "User update successfully" };
}


export async function fetchProfilePictureUser(userId: number): Promise<string> {
    const url = NEXT_PUBLIC_STORAGE_PROFILE_PICTURES + `/${userId}.png`;
    const response = await fetch(url);
    if (response.ok) {
      return `${url}?${new Date().getTime()}`;
    } else {
      return "/book.jpg"; // Default image
    }
  }

  
  export async function putProfilePictureBackend(formData: FormData, userId: number) {
    try {
         // TODO: Accept other images formats (e.g. jpeg, jpg)
         const response = await fetch(NEXT_PUBLIC_STORAGE_PROFILE_PICTURES + `/${userId}.png?${NEXT_PUBLIC_AZURE_SAS_STORAGE}`, {
           method: 'PUT',
           body: formData.get('file'),
           headers: {
               'Content-Type': 'image/png',
               'x-ms-blob-type': 'BlockBlob',
               'x-ms-date': new Date().toUTCString(),
           }
         });

       } catch (error) {
         console.error("Failed to upload the image", error);
       }
   }

// Function to load the posts in the home page
export async function loadPosts() : Promise<Post[]|null> {
    try {
        const response = await fetch(baseUrl + "/posts/all", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
        }).then((res) => res.json());

        return response.map((post: Post) => {
            return {
                id: post.id,
                book_id: post.book_id,
                user_id: post.user_id,
                description: post.description,
                likes: post.likes,
                created_at: post.created_at,
            };
        });

    }
    catch (error) {
        console.error("Failed to load posts", error);
        return null;
    }
}

export async function CreatePost(prevState: unknown, formData: FormData) {
    const submission = parseWithZod(formData, { schema: createPostSchema });

    if (submission.status !== "success") {
        return {message: "Do not pass the validation"};
    }

    const accessToken = cookies().get('accessToken')?.value;
    const user : User | null = await getSession();

    const post_description = formData.get("post_description") as string;
    // Delete the description from the formData
    formData.delete("post_description");

    // Convert formData to a JSON object
    const data = Object.fromEntries(formData.entries());

    // First check if I can create a book with the given data
    try {
        console.log("Book data and ACCTOKEN", data, accessToken);
        const response = await fetch(baseUrl + "/books/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        }).then(async (res) => {

            if (!res.ok) {
                const errorMessage = await res.text();
                return { message: "Failed to create the Book, try again later" };
            }
            // Check if the response is ok
            const response = await res.json();

            // If I can create the book, then I can create the post
            const book_id = response.data.id;
            const post_formData = new URLSearchParams();
            post_formData.append("user_id", user?.id.toString() as string);
            post_formData.append("book_id", book_id.toString());
            post_formData.append("description", post_description);
            post_formData.append("created_at", new Date().toISOString());

            const data = Object.fromEntries(post_formData.entries());

            const post_response = await fetch(baseUrl + "/posts/", {
                method: "POST",
                headers: {
                'Content-Type': 'application/json',
                    authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(data),
            }).then(async (res) => {
                const response = await res.json();
                console.log("RESPONSE", response);
                return { message: response.message };
            });
        });
    }
    catch (error) {
        console.log("FAILDED to create the post or book", error);
        return { message: "Failed to create the Post, try signing in again" };
    }

}
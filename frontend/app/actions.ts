"use server";

// Importing necessary functions from Next.js and other libraries
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {User} from "@/app/types/User";
import { Post } from "@/app/types/Post";
import { BaseNextRequest } from "next/dist/server/base-http";
import { parseWithZod } from "@conform-to/zod";
import {getAccessToken, getSession} from "./lib/authentication";
import { userInformationSchema } from "./lib/zodSchemas";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;
const NEXT_PUBLIC_AZURE_SAS_STORAGE = process.env.NEXT_PUBLIC_AZURE_SAS_STORAGE;
import {createPostSchema} from "@/app/lib/zodSchemas";
import {toast} from "nextjs-toast-notify";

// Function to update the user's information
export async function UpdateUser(prevState: unknown, formData: FormData) {

    // Validate the form data using Zod
    const submission = parseWithZod(formData, { schema: userInformationSchema });

    // Handle validation errors if present
    if (submission.status !== "success") {
        return {status: 400, message: "Invalid Form", Data: null };
    }

    const userServer = await getSession();
    const accessToken = await getAccessToken();
    if(!userServer || !accessToken) return  {status: 403, message: "Unauthorized", Data: null };

    // Convert formData to URLSearchParams for application/x-www-form-urlencoded format
    const data = new URLSearchParams();
    data.append("id", userServer.id.toString());
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
    if(!user) return { message: "Status: 403, Message: Unauthorized, Data: null" };

    try {
        // Convert formData to JSON and verify the user with the access token
        const data = Object.fromEntries(formData);
        const accessToken = cookies().get('accessToken')?.value;

        const response = await fetch(baseUrl + `/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data),
        });
        if (response.status != 200) {
            const errorData = await response.json();
            throw new Error(errorData.detail);
        }
        // If the response is ok, then update the user's information
        const userData = await response.json();
        console.log("RESPONSE", userData);

        // Update the user's information in the cookie
        cookies().set('user', JSON.stringify(user));
        return {status: response.status, message: "Status: 200, Message: User updated successfully", data: userData};

    } catch (error: any) {
        return { status:400, message: error.message, data: null };
    }

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
import {Filter} from "@/app/types/Filter";
// Function to load the posts in the home page
export async function loadPosts(): Promise<{ status: number, message: string, post: Post[] | null, filters: Array<Filter[]>|null}> {
    try {
        const response = await fetch(baseUrl + "/posts/all", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
        });

        if (response.status != 200) {
            const errorData = await response.json();
            throw new Error(errorData.detail);
        }
        const result = await response.json();
        console.log("POSTS", result);
        return { status: 200, message: "Posts loaded successfully", post: result.posts, filters: result.filters };


        /*return response.map((post: Post) => {
            return {
                id: post.id,
                book_id: post.book_id,
                user_id: post.user_id,
                description: post.description,
                likes: post.likes,
                created_at: post.created_at,
            };
        });*/


    }
    catch (error:any) {
        console.error("Failed to load posts", error);
        return  { status: 400, message: error.detail, post: null, filters: null };
    }
}

export async function CreatePost(prevState: unknown, formData: FormData) {
    const submission = parseWithZod(formData, { schema: createPostSchema });

    if (submission.status !== "success") {
        return {message: "Status: 300, Message: Do not pass the validation"};
    }

    const accessToken = await getAccessToken();
    const user : User | null = await getSession();
    if(!user || !accessToken) return { message: "Status: 403, Message: Unauthorized" };

    const post_description = formData.get("post_description") as string;
    const tags = formData.getAll("tags");
    console.log("TAGS", tags);
    // Delete the description from the formData
    formData.delete("post_description");
    formData.delete("tags");

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
            body: JSON.stringify(data)
        }).then(async (res) => {
            if (res.status != 200) {
                const errorData = await res.json();

                throw new Error(`Status: ${res.status}, Message: ${errorData.detail}`);
            }
            // Check if the response is ok
            const response = await res.json();

            // If I can create the book, then I can create the post
            const book_id = response.data.id;

            const filterIdsArray = tags.map(tag => Number(tag));
            const postData = {
              book_id: book_id,
              user_id: user?.id,
              description: post_description,
              likes: 0,
              created_at: new Date().toISOString(),
              filter_ids: filterIdsArray
            };
            console.log("POST DATA", postData);

            await fetch(baseUrl + "/posts/", {
                method: "POST",
                headers: {
                'Content-Type': 'application/json',
                    authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(postData),
            }).then(async (res) => {
                    if (res.status != 200) {
                        const errorData = await res.json();

                        throw new Error(`Status: ${res.status}, Message: ${errorData.detail}`);
                    }
            });

        });
    }
    catch (error: any) {
        console.log("FAILDED to create the post or book", error);
        return { message: error.message };
    }

    return { message: "Status: 200, Message: Post created successfully" };

}


// Function to load filters tags from the backend
export async function loadFilters() {

    try {
        const res =  await fetch(baseUrl + "/filters/all", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
        })
        if (res.status != 200) {
            const errorData = await res.json();
            throw new Error(errorData.detail);
        }
        const response = await res.json();
        console.log("FILTERS", response);

        return { status: 200, message: "Filters loaded successfully", data: response };

    }
    catch (error: any) {
        return { status: 400, message: error.message, data: null };
    }

}
"use server";

// Importing necessary functions from Next.js and other libraries
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {User} from "@/app/types/User";
import { Post } from "@/app/types/Post";
import {getSession} from "@/app/lib/authentication";
import {parseWithZod} from "@conform-to/zod";
import {userInformationSchema} from "@/app/lib/zodSchemas";


// Function to update the user's information
export async function UpdateUser(prevState: unknown, formData: FormData) {

    // Validate the form data using Zod
    const submission = parseWithZod(formData, { schema: userInformationSchema });

    // Handle validation errors if present
    if (submission.status !== "success") {
        return submission.reply();
    }

    const userCookie =await  getSession();
    if(!userCookie) return;

    // Convert formData to URLSearchParams for application/x-www-form-urlencoded format
    const data = new URLSearchParams();
    data.append("id", userCookie.id.toString());
    data.append("username", formData.get("username") as string);
    data.append("first_name", formData.get("first_name") as string);
    data.append("last_name", formData.get("last_name") as string);
    data.append("biography", formData.get("biography") as string);

    // Update the user's information
    const user = Object.fromEntries(data.entries());
    console.log("User New DATA INFORMATION", user);
    if(!user) return;

    try {
        // Convert formData to JSON and verify the user with the access token
        const data = Object.fromEntries(formData);
        const accessToken = cookies().get('accessToken')?.value;

        await fetch(`http://127.0.0.1:8000/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        }
        );

    } catch (error) {
        console.error("Error:", error);
    }

    // Update the user's information in the cookie
    cookies().set('user', JSON.stringify(user));
}

export async function putProfilePictureBackend(formData: FormData, userId: number) {
 try {
      const response = await fetch(`http://127.0.0.1:8000/users/pfp/${userId}`, {
        method: 'PUT',
        body: formData,
      }).then( (res) => res.json());

      if (!response.ok) {
        console.error("Failed to upload the image");
        return null;
      }

    } catch (error) {
      console.error("Failed to upload the image", error);
    }
}

// Function to load the posts in the home page
export async function loadPosts() : Promise<Post[]|null> {
    try {
        const response = await fetch("http://127.0.0.1:8000/posts/all", {
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

export async function loadMockedPosts(): Promise<Post[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
        {
            id: 1,
            book_id: 101,
            user_id: 1,
            description: "This is a fascinating book about AI and its impact on society.",
            likes: 120,
            created_at: "2024-01-01T12:00:00Z",
        },
        {
            id: 2,
            book_id: 102,
            user_id: 2,
            description: "A deep dive into the mysteries of the universe. Highly recommend!",
            likes: 98,
            created_at: "2024-02-10T15:30:00Z",
        },
        {
            id: 3,
            book_id: 103,
            user_id: 3,
            description: "An inspiring story of perseverance and innovation.",
            likes: 56,
            created_at: "2024-03-15T09:45:00Z",
        },
        {
            id: 4,
            book_id: 104,
            user_id: 4,
            description: "A thrilling fantasy novel full of twists and magic.",
            likes: 78,
            created_at: "2024-04-05T18:20:00Z",
        },
        {
            id: 5,
            book_id: 105,
            user_id: 5,
            description: "A comprehensive guide to mastering JavaScript in 2024.",
            likes: 34,
            created_at: "2024-05-21T22:10:00Z",
        },
    ];
}

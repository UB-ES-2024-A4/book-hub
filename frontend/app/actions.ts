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

export async function fetchUser(userId: number): Promise<User | null> {
    try {
        const response = await fetch(`http://127.0.0.1:8000/users/${userId}`);
        if (!response.ok) {
            console.error(`Failed to fetch user with ID ${userId}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export async function isUserFollowing(
    currentUserId: number,
    targetUserId: number
): Promise<boolean | null> {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/followers/${currentUserId}/${targetUserId}`
        );
        if (!response.ok) {
            console.error(
                `Failed to check if user ${currentUserId} is following ${targetUserId}`
            );
            return null;
        }
        const data = await response.json();
        return data.is_following;
    } catch (error) {
        console.error("Error checking following status:", error);
        return null;
    }
}

export async function followUser(followerId: number, followeeId: number): Promise<any | null> {
    try {
        const response = await fetch(`http://127.0.0.1:8000/followers/follow/${followeeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                follower_id: followerId,
                followee_id: followeeId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to follow user:", errorData.detail);
            return null;
        }

        return await response.json(); // Return the follow relationship data
    } catch (error) {
        console.error("Error while following user:", error);
        return null;
    }
}

export async function unfollowUser(followerId: number, followeeId: number): Promise<any | null> {
    try {
        const response = await fetch(`http://127.0.0.1:8000//followers/unfollow/${followeeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                follower_id: followerId,
                followee_id: followeeId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to unfollow user:", errorData.detail);
            return null;
        }

        return await response.json(); // Return the response or confirmation
    } catch (error) {
        console.error("Error while unfollowing user:", error);
        return null;
    }
}

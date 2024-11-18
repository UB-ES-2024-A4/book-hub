"use server";

// Importing necessary functions from Next.js and other libraries
import { parseWithZod } from "@conform-to/zod";
import { signInSchema, signUpSchema } from "@/app/lib/zodSchemas";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {User} from "@/app/types/User";
import { Post } from "@/app/types/Post";
import {createPostSchema} from "@/app/lib/zodSchemas";
import {getSession} from "@/app/lib/authentification";


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
        const response = await fetch('http://127.0.0.1:8000/users/', {
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
        data.append("username", formData.get("user") as string);
        data.append("password", formData.get("password") as string);

        const response = await fetch('http://127.0.0.1:8000/users/login/access-token', {
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


export async function loadUser(): Promise<User | null> {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        // Redirect to sign-in if no access token is found
        redirect('/auth/sign-in');
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/users/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/json"
            },
            credentials: 'include'
        }).then((res) => res.json());

        if (!response.id) {
            return null;
        }

        return {
            id: response.id,
            firstName: response.first_name,
            lastName: response.last_name,
            username: response.username,
            email: response.email,
            bio: response.biography ?? "Add your bio!",
            profilePicture: "/vini.jpg",
            coverPhoto: "/book.jpg",
        };



    }catch (error) {
        console.error("Failed to load user information", error);
        return null;
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
        const response = await fetch("http://127.0.0.1:8000/books/", {
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

            const data = Object.fromEntries(post_formData.entries());

            const post_response = await fetch("http://127.0.0.1:8000/posts/", {
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
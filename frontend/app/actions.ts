"use server";

// Importing necessary functions from Next.js and other libraries
import { cookies } from "next/headers";
import {User} from "@/app/types/User";
import { parseWithZod } from "@conform-to/zod";
import {getAccessToken, getSession} from "./lib/authentication";
import { userInformationSchema } from "./lib/zodSchemas";
import {CommentUnic, PostStorage} from "@/app/types/PostStorage";
import {Filter} from "@/app/types/Filter";

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
    console.log("FORM DATA", formData);

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
      return "/logo.png"; // Default image
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
         }).then((response) => {
              if (! response.ok) {
                 throw new Error(response.statusText);
              }
         });

       } catch (error:any) {
         console.error("Failed to upload the image", error);

            toast.warning(error.message, {
                duration: 4000, progress: true, position: "top-right", transition: "swingInverted",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"> ' +
                    '<g fill="none" stroke="#FF4500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ' +
                    '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/> <path d="M12 9v4M12 17h.01"/> </g> </svg>',
                sonido: true,
            });
       }
   }

// Function to load the posts in the home page
export async function loadPosts(filters: string|undefined = undefined, skip: number = 0, limit: number = 10, page: string = 'home'
                                ): Promise<{ status: number, message: string, data: PostStorage[] | null}> {
    try {
        const accessToken = await getAccessToken();

        const url = baseUrl + `/${page}` + (filters ? `/?filters=${filters}&skip=${skip}&limit=${limit}` :
            `/?skip=${skip}&limit=${limit}`);

        const headers: HeadersInit = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };

        if ((page === 'home') || (page === 'explorer' && accessToken)) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers,
        });

        if (response.status != 200) {
            const errorData = await response.json();
            throw new Error(errorData.detail);
        }
        const postResult = await response.json();
        console.log("POSTS SOLOS POSTSTORAGE___________-", postResult);
        const returnedPosts: PostStorage[] = [];

       /*Almacenar los posts en un arreglo de objetos PostStorage*/
        postResult.forEach((post_info: any) => {
            const postStorage: PostStorage = {
                user: post_info.user,
                post: post_info.post,
                book: post_info.book,
                filters: post_info.filters,
                like_set: post_info.like_set,
                n_comments: post_info.n_comments,
                comments: post_info.comments
            }
            returnedPosts.push(postStorage);
        });

        console.log("POSTS RETURNED", returnedPosts);

        return { status: 200, message: "Posts loaded successfully", data: returnedPosts};

    }
    catch (error:any) {
        console.error("Failed to load posts", error);
        return  { status: 400, message: error.message, data: null };
    }
}


export async function CreatePost(prevState: unknown, formData: FormData) : Promise<{status: number, message:string, data: PostStorage | null}> {
    // Validate the form data using Zod
    const submission = parseWithZod(formData, { schema: createPostSchema });

    if (submission.status !== "success") {
        return { status: 300 , message: "Invalid Form", data: null };
    }

    const accessToken = await getAccessToken();
    const user : User | null = await getSession();
    if(!user || !accessToken) return { status: 403, message: "Unauthorized", data: null };

    const post_description = formData.get("post_description") as string;
    const tags = formData.getAll("filter_ids")
    console.log("TAGS", tags);
    // Delete the description from the formData
    formData.delete("post_description");
    formData.delete("filter_ids");

    // Convert formData to a JSON object
    const data = Object.fromEntries(formData.entries());

    // First check if I can create a book with the given data
    try {
        console.log("Book data and ACCTOKEN", data, accessToken);
        const bookResponse = await fetch(baseUrl + "/books/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data)
        });

        if (bookResponse.status != 200) {
            const errorData = await bookResponse.json();
            console.log("ERROR DATA", errorData);
            throw new Error(`${bookResponse.status},${errorData.detail}`);
        }

        // Check if the response is ok
        const bookData = await bookResponse.json();

        // If I can create the book, then I can create the post
        const book_id = bookData.data.id;

        const filtersArray: number[] = JSON.parse(tags[0] as string);
        console.log("FILTERS ARRAY", filtersArray);
        const postData = {
            book_id: book_id,
            user_id: user?.id,
            description: post_description,
            likes: 0,
            created_at: new Date().toISOString(),
            filter_ids: filtersArray
        }

        console.log("POST DATA", postData);
        console.log("JSON POST DATA", JSON.stringify(postData));

        const postResponse = await fetch(baseUrl + "/posts/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(postData),
        });

        // Si no se puede crear el post, entonces se elimina el libro
        if (postResponse.status != 200) {
            const errorData = await postResponse.json();
            console.log("ERROR DATA", errorData);
            throw new Error(`${postResponse.status},${errorData.detail}`);
        }

        // Si es un éxito la creación del post, entonces se retorna el post
        const post_filters = await postResponse.json();
        console.log("POST FILTERS FOR POST STORAGE", post_filters);

        const filters = post_filters['filters'];
        // Convertirlo en Array Number
        const filtersArrayNumber: number[] = filters.map((filter: Filter) => filter.id);
        const postStorage: PostStorage = {
            user: { id: user.id, username: user.username, following: false},
            post: post_filters['post'],
            book: bookData.data,
            filters: filtersArrayNumber,
            like_set: false,
            n_comments: 0,
            comments: []
        }

        console.log("POST STORAGE CREATED WITH ALL FETCH: ", postStorage);

        return { status: 200, message: post_filters.message, data: postStorage};

    } catch (error: any) {
        console.log("FAILDED to create the post or book", error);
        const errorData = error.message.split(",");
        const status = errorData[0]; const message = errorData[1];
        console.log("ERROR DATA", status, message);
        return { status: Number(status), message: message, data: null };
    }
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

export async function followUser(followerId: number, followeeId: number) {
    try {
        const response = await fetch(`${baseUrl}/followers/follow/${followeeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${await getAccessToken()}`,
            },
            body: JSON.stringify({
                follower_id: followerId,
                followee_id: followeeId,
            }),
        });

        if (response.status!==200) {
            const errorData = await response.json();
            console.error("Failed to follow user:", errorData.detail);
            throw new Error(errorData.detail);
        }

        return {status: 200, message: "User followed successfully", data: await response.json()};
    } catch (error: any) {
        console.error("Error while following user:", error);
        return { status: 400, message: error.message, data: null };
    }
}

export async function unfollowUser(followerId: number, followeeId: number) {
    try {
        const response = await fetch(`${baseUrl}/followers/unfollow/${followeeId}`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${await getAccessToken()}`,
            },
        });

        if(response.status === 403) // Forbidden, user do not have permission to unfollow
            return {status: 403, message: "Could not validate Credentials. Try Sign In again", data: null};

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to unfollow user:", errorData.detail);
            throw new Error(errorData.detail);
        }

        return {status: 200, message: "User unfollowed successfully", data: await response.json()};

    } catch (error: any) {
        console.error("Error while unfollowing user:", error);
        return { status: error.status, message: error.message, data: null };
    }

}

export async function likePost(userId: number, postId: number) {
  try {
    const response = await fetch(`${baseUrl}/likes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${await getAccessToken()}`,
    },
      body: JSON.stringify({
        user_id: userId,
        post_id: postId,
      }),
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      console.error('Failed to like post:', errorData.detail);
      return { status: response.status, message: errorData.detail };
    }

    const data = await response.json();
    return { status: 200, message: 'Post liked successfully', data };
  } catch (error: any) {
    console.error('Error while liking post:', error);
    return { status: 400, message: error.message };
  }
}

export async function unlikePost(userId: number, postId: number) {
    try {
      const response = await fetch(`${baseUrl}/likes/${postId}&${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${await getAccessToken()}`,
        },
      });
  
      if (response.status !== 200) {
        const errorData = await response.json();
        console.error('Failed to unlike post:', errorData.detail);
        return { status: response.status, message: errorData.detail };
      }
  
      return { status: 200, message: 'Post unliked successfully' };
    } catch (error: any) {
      console.error('Error while unliking post:', error);
      return { status: 400, message: error.message };
    }
}
  
//Fetch All Comments by posts ID
export async function fetchCommentsByPostID(postId: number): Promise<{status: number, message: string, data: CommentUnic[] | null}> {
    try {
        const response = await fetch(`${baseUrl}/comments/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${await getAccessToken()}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to unfollow user:", errorData.detail);
            throw new Error(errorData.detail);
        }
        return {status: 200, message: "Comments fetched successfully", data: await response.json()};
    } catch (error: any) {
        console.error("Error fetching comments:", error);
        return {status: 400, message: error.message, data: null};
    }
}

// Method that post a comment in a post
export async function postComment(post_id: number, comment: string) {
    try {
        const response = await fetch(`${baseUrl}/comments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${await getAccessToken()}`,
            },
            body: JSON.stringify({ comment, post_id }),
        });

        if (response.status !== 200) {
            const errorData = await response.json();
            console.error("Failed to post comment:", errorData.detail);
            throw new Error(errorData.detail);
        }

        return {status: 200, message: "Comment posted successfully", data: await response.json()};

    } catch (error: any) {
        console.error("Error while posting comment:", error);
        return { status: 400, message: error.message, data: null };
    }
}

// Method that deletes a comment in a post
export async function deleteComment(commentId: number) {
    try {
        const response = await fetch(`${baseUrl}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${await getAccessToken()}`,
            },
        });

        if (response.status !== 200) {
            const errorData = await response.json();
            console.error("Failed to delete comment:", errorData.detail);
            throw new Error(errorData.detail);
        }

        return {status: 200, message: "Comment deleted successfully", data: await response.json()};

    } catch (error: any) {
        console.error("Error while deleting comment:", error);
        return { status: 400, message: error.message, data: null };
    }
}

export async function logOut() {
    try {
        const response = await fetch(`${baseUrl}/users/logout`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${await getAccessToken()}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to logout user:", errorData.detail);
            return null;
        }

        (await cookies()).delete('user');
        (await cookies()).delete('accessToken');

        return await response.json();// // Return the response or confirmation
    } catch (error) {
        console.error("Error while logging user out:", error);
        return null;
    }
}

export async function fetchUserData(profileId: number, currentId: number | undefined) {
    try {
        const response = await fetch(`${baseUrl}/users/${profileId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to get user:", errorData.detail);
            throw new Error(errorData.detail);
        }
        const data = await response.json();

        if (currentId != undefined) {
            const res = await fetch(`${baseUrl}/followers/${currentId}/${profileId}`)
            const following = await res.json()
            data['following'] = following['success']
        }
        
        return { status: 200, message: "User loaded successfully", data: data };

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
}

export async function searchUsersHandler(search: string) {
    try {
        const response = await fetch(`${baseUrl}/search/?query=${search}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${await getAccessToken()}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to search users:", errorData.detail);
            throw new Error(errorData.detail);
        }
        const users = await response.json();

        return {status: 200, message: "Users fetched successfully", data: users.users};

    } catch (error: any) {
        console.error("Error while searching users:", error);
        return { status: 400, message: error.message, data: null };
    }
}

export async function getPostList(userId: number) {
    try {
        const response = await fetch(`${baseUrl}/account/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to get user posts:", errorData.detail);
            throw new Error(errorData.detail);
        }
        const data = await response.json();

        const userPosts: PostStorage[] = [];
        data.forEach((post_info: any) => {
            const postStorage: PostStorage = {
                user: post_info.user,
                post: post_info.post,
                book: post_info.book,
                filters: post_info.filters,
                like_set: post_info.like_set,
                n_comments: post_info.n_comments,
                comments: post_info.comments
            }
            userPosts.push(postStorage);
        });

        return { status: 200, message: "Posts loaded successfully", data: data };
        
    } catch (error) {
        console.error("Error fetching user posts:", error);
    }
}

export async function loadUserPostsAndLiked(user_id: number) {
    try {
        const response = await fetch(`${baseUrl}/account/liked/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getAccessToken()}`,
            
            },
        });

        if (response.status !== 200 && response.status !== 307) {
            const errorData = await response.json();
            console.error("Failed to fetch user liked posts:", errorData.detail);
            throw new Error(errorData.detail);
        }

        const responsUserPosts = await fetch(`${baseUrl}/account/${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getAccessToken()}`,
            },
        });

        if (response.status !== 200 && response.status !== 307) {
            const errorData = await responsUserPosts.json();
            console.error("Failed to fetch user posts and liked:", errorData.detail);
            throw new Error(errorData.detail);
        }

        const datap = {
            postUser: await responsUserPosts.json(),
            postLiked: await response.json()
        }
        console.log("DATA POSTS AND LIKED", datap);

        return {status: 200, message: "User posts and liked fetched successfully", data: datap};

    } catch (error: any) {
        console.error("Error while fetching user posts and liked:", error);
        return { status: 400, message: error.message, data: null };
    }
}
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Heart, MessageCircle, Share2} from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Post } from "@/app/types/Post";
import "../style.css";
import NoPostError from "@/app/home/Errors/NoPostError";
import {User} from "@/app/types/User";
import FetchError from "@/components/FetchError";
import { fetchUser, isUserFollowing, followUser, unfollowUser } from "@/app/actions";
import {getAccessToken} from "@/app/lib/authentication";
import {Book} from "@/app/types/Book";
import {useFeed} from "@/contex/FeedContext";
import {toast} from "nextjs-toast-notify";

type Props = {
  userData: User;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ScrollAreaHome({ userData }: Props) {
  const currentUserId = userData.id;
  console.log("USER DATA ID", userData.id);

  // State to hold other users' data and following status
  const [postUsersData, setPostUsersData] = useState<{
    [key: number]: {
      user: User;
      isFollowing: boolean;
    };
  }>({});

    const [booksMap, setBooksMap] = useState<{ [key: number]: Book }>({});
    const [error, setError] = useState<string | null>(null);
    const { posts:postsContext, booksMap: booksContext, usersMap: usersContex,
        addBookToMap, addUserToMap
    } = useFeed();

  useEffect(() => {
    if ( postsContext && currentUserId) {
        console.log("POSTS CONTEXT", postsContext);
        const usersMap: { [key: number]: { user: User; isFollowing: boolean }; } = {};

        const fetchUserData = async () => {
        try {
            console.log("POSTS CONTEXT", postsContext);
            postsContext.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            const booksMap: { [key: number]: Book } = {};

                await Promise.all(
                    postsContext.map(async (post) => {

                        // Verify if the user is already in the map
                        if (usersMap[post.user_id]) {
                            return;
                        }

                        // Fetch the post author's data
                        const result = await fetchUser(post.user_id);

                        // If no user is found, skip processing this post
                        if (result.status !== 200) {
                            console.warn(`User with ID ${post.user_id} not found.`);
                            return;
                        }
                        const user = result.data;
                        // Check if the current user is following the post author
                        const isFollowing =
                            (await isUserFollowing(currentUserId, post.user_id)) ?? false;

                        console.log(
                            `Current user is ${
                                isFollowing ? "following" : "not following"
                            } the post author.`
                        );

                        // Add to usersMap only if user exists
                        usersMap[post.user_id] = { user, isFollowing };

                        const bookResponse = await fetch(baseUrl + `/books/${post.book_id}`, {
                            method: "GET",
                            headers: {
                                authorization: `Bearer ${ await getAccessToken() }` || "",
                            },
                        });
                        booksMap[post.book_id] = await bookResponse.json();
                    })
                );

                setPostUsersData(usersMap);
                setBooksMap(booksMap);
            } catch (error) {
                console.error("Failed to fetch user data", error);
                setError(`Failed to fetch user data ${error}`); // Establece el estado de error
            }
        };

        fetchUserData();
        console.log("USERS MAP: ", usersMap);
        console.log("BOOKS MAP: ", booksMap);
    }
  }, [postsContext, currentUserId]);

  // Handle follow/unfollow button click
  const handleFollowClick = async (
    postUserId: number,
    isCurrentlyFollowing: boolean
  ) => {
    // Optimistically update the following status
    setPostUsersData((prevData) => ({
      ...prevData,
      [postUserId]: {
        ...prevData[postUserId],
        isFollowing: !isCurrentlyFollowing,
      },
    }));

    try {
      if (isCurrentlyFollowing) {
        // Unfollow the user
        const result = await unfollowUser(currentUserId, postUserId);
        if (!result) {
          throw new Error("Unfollow action failed");
        }
      } else {
        // Follow the user
          console.log("CURRENT USER ID", currentUserId);
          console.log("POST USER ID", postUserId);
        const result = await followUser(currentUserId, postUserId);
        if (!result) {
          throw new Error("Follow action failed");
        }
      }
    } catch (error) {
          console.error("Failed to update following status", error);

          // Revert the following status in state
          setPostUsersData((prevData) => ({
            ...prevData,
            [postUserId]: {
              ...prevData[postUserId],
              isFollowing: isCurrentlyFollowing, // Revert to previous state
            },
          }));
          // Show a toast notification
            toast.error("Action Failed", {
                duration: 4000,
                progress: true,
                position: "top-center",
                transition: "swingInverted",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
                sonido: true,
              });
    }
  };

    if (!postsContext) {
        return <div className="flex-1 overflow-hidden pt-5">Loading...</div>;
    }


    return (
        <div className="flex-1 overflow-hidden pt-5">
              <ScrollArea className="h-[calc(100vh-64px)] w-full">
                <div className="p-4 space-y-4">
                  {postsContext.length === 0 || error ? (
                    error ? (
                      <FetchError />
                    ) : (
                      <NoPostError />
                    )
                  ) : (
                   postsContext && postsContext.map((post_I: Post) => {
                        const userInfo = postUsersData[post_I.user_id];
                        const user = userInfo?.user;
                        const isFollowing = userInfo?.isFollowing;
                        const book: Book = booksMap[post_I.book_id]
                       console.log("user ID", user?.id, "current user ID", currentUserId);
                            return (
                                <Card key={post_I.id} className="mx-auto md:mx-20 max-w-4xl bg-gradient-to-br from-gray-900 to-blue-900 text-white shadow-xl">
                                        <CardHeader className="flex-row items-center border-b border-blue-800 pb-4">
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="w-10 h-10 border-2 border-blue-400">
                                                    <AvatarImage src={user? `${baseUrl}/users/pfp/${user.id}`: "/book-signup.jpg"} />
                                                    <AvatarFallback>{user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-semibold text-blue-300">@{user?.username || "Unknown User"}</span>
                                                {currentUserId != user?.id && (
                                                      <Button
                                                        variant={isFollowing ? "default" : "outline"}
                                                        className={`relative h-8 ${
                                                          isFollowing ? "bg-gray-500" : "bg-blue-500"
                                                        } text-white font-semibold py-2 px-4 rounded-l-md group`}
                                                        onClick={() =>
                                                          handleFollowClick(post_I.user_id, isFollowing)
                                                        }
                                                      >
                                                        {isFollowing ? "Following" : `Follow`}
                                                      </Button>
                                                    )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="grid md:grid-cols-[150px_1fr] gap-4">
                                                <Image alt="Book cover" className="rounded-lg object-cover shadow-md" width={150} height={200} src="/book.jpg" />
                                                <div className="space-y-3">
                                                    <div>
                                                        <h2 className="text-xl font-bold text-blue-200">{book?.title}</h2>
                                                        <p className="text-blue-400">by {book?.author}</p>
                                                    </div>
                                                    <p className="text-sm text-gray-300">{post_I.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {post_I.filter_ids && post_I.filter_ids.map((tag: { id: number, name: string }) => (
                                                            <Badge key={tag.id} variant="secondary" className="bg-gradient-to-br from-blue-100 via-gray-200 to-blue-400 p-1 hover:bg-gradient-to-br hover:from-gray-700 hover:via-blue-500 hover:to-gray-200">
                                                                {tag.name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                {/*<CardFooter className="flex justify-between">
                                    <div className="flex gap-4">
                                      <Button variant="ghost" size="sm">
                                        <Heart className="w-4 h-4 mr-2" />
                                        Like
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                      </Button>
                                    </div>
                                    <Button variant="outline" size="sm">
                                      Comment Book
                                    </Button>
                                  </CardFooter>*/}
                            </Card>
                            )
                        })
                    )
                  }
                </div>
            </ScrollArea>
        </div>
    );
}

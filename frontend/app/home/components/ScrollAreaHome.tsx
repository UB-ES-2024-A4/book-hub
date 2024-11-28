import React, {Suspense, useEffect, useState} from "react";
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
import {fetchUser, isUserFollowing, followUser, unfollowUser, loadPosts} from "@/app/actions";
import {getAccessToken} from "@/app/lib/authentication";
import {Book} from "@/app/types/Book";
import {useFeed} from "@/contex/FeedContext";
import {toast} from "nextjs-toast-notify";
import {getColorFromInitials} from "@/app/lib/colorHash";
import UserNoLogged from "@/components/auth/UserNoLogged";
import LoadingSpinner from "@/components/Loading";
import {PostStorage} from "@/app/types/PostStorage";

type Props = {
  userData: User;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
// URL de la API de Azure Storage
const NEXT_PUBLIC_STORAGE_BOOKS = process.env.NEXT_PUBLIC_STORAGE_BOOKS;
const NEXT_PUBLIC_AZURE_SAS_STORAGE_BOOKS = process.env.NEXT_PUBLIC_AZURE_SAS_STORAGE_BOOKS;

export default function ScrollAreaHome({ userData }: Props) {

  const currentUserId = userData.id;
  const [loading, setLoading] = useState(true);
  console.log("USER DATA ID", userData.id);

  // State to hold other users' data and following status
  const [postUsersData, setPostUsersData] = useState<{
    [key: number]: {
      user: User;
      isFollowing: boolean;
    };
  }>({});

    const { posts:postsContext,  addAllPosts, filters } = useFeed();

  useEffect(() => {

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
        if ( result.status !== 200)
          throw new Error(result.message);

      } else {
        const result = await followUser(currentUserId, postUserId);
        if (result.status !== 200)
          throw new Error(result.message);
      }
    } catch (error: any) {
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
            toast.error(error.message, {
                duration: 4000,
                progress: true,
                position: "top-center",
                transition: "swingInverted",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n' +
                    '  <circle cx="12" cy="12" r="10"/>\n' +
                    '  <line x1="12" y1="8" x2="12" y2="12"/>\n' +
                    '  <line x1="12" y1="16" x2="12.01" y2="16"/>\n' +
                    '</svg>',
                sonido: true,
              });
    }
  };


    // Mostrar el estado de carga o error
    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex-1 overflow-hidden pt-5">
            <ScrollArea className="h-[calc(100vh-64px)] w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
                    {Object.keys(postsContext).length === 0 ?(
                            <NoPostError/>
                        )
                    : (
                        postsContext && Object.values(postsContext).map((post_I: PostStorage) => {
                            const user = post_I.user;
                            const isFollowing = user.is_following
                            const book: Book = post_I.book;
                            console.log("user ID", user?.id, "current user ID", currentUserId);
                            return (
                                <Card key={post_I.post.id}
                                      className="max-w-7xl bg-gradient-to-br from-gray-900 to-blue-900 text-white shadow-xl col-span-1">
                                    <CardHeader className="flex-row items-center border-b border-blue-800 pb-4">
                                        <div className="flex items-center space-x-2">
                                            <Avatar className="w-10 h-10 border-2 border-blue-400">
                                                <AvatarImage
                                                    src={user ? `${baseUrl}/users/pfp/${user.id}` : "/logo.png"}/>
                                                <AvatarFallback
                                                    style={{
                                                        backgroundColor: user?.username
                                                            ? getColorFromInitials(user.username.substring(0, 2).toUpperCase())
                                                            : 'hsl(215, 100%, 50%)',
                                                    }}
                                                    className="text-white font-semibold text-sm flex items-center justify-center"
                                                >
                                                    {user?.username
                                                        ? user.username.substring(0, 2).toUpperCase()
                                                        : '?'}
                                                </AvatarFallback>
                                            </Avatar>

                                            <span
                                                className="font-semibold text-blue-300">@{user?.username || "Unknown User"}</span>
                                            {currentUserId != user?.id && (
                                                <Button
                                                    variant={isFollowing ? "default" : "outline"}
                                                    className={`relative h-8 ${
                                                        isFollowing ? "bg-gray-500" : "bg-blue-500"
                                                    } text-white font-semibold py-2 px-4 rounded-l-md group`}
                                                    onClick={() =>
                                                        handleFollowClick(user.id, isFollowing)
                                                    }
                                                >
                                                    {isFollowing ? "Following" : `Follow`}
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid md:grid-cols-[150px_1fr] gap-4">
                                            <Image alt="Book cover" className="rounded-lg object-cover shadow-md"
                                                   width={500} height={500}
                                                   src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${book.id}.png` || 'logo.png'}/>
                                            <div className="space-y-3">
                                                <div>
                                                    <h2 className="text-xl font-bold text-blue-200">{book?.title}</h2>
                                                    <p className="text-blue-400">by {book?.author}</p>
                                                </div>
                                                <p className="text-sm text-gray-300">{post_I.post.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {post_I.filters && Object.values(post_I.filters).map((id: number, index) => (
                                                        <Badge key={index} variant="secondary"
                                                               className="bg-gradient-to-br from-blue-100 via-gray-200 to-blue-400 p-1 hover:bg-gradient-to-br hover:from-gray-700 hover:via-blue-500 hover:to-gray-200">
                                                            {filters[id]}
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

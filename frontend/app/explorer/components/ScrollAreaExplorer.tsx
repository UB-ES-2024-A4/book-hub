import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/app/types/User";
import { getColorFromInitials } from "@/app/lib/colorHash";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {useFeed} from "@/contex/FeedContext";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "@/app/actions";
import { toast } from "nextjs-toast-notify";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const NEXT_PUBLIC_STORAGE_BOOKS = process.env.NEXT_PUBLIC_STORAGE_BOOKS;

type Props = {
  userData: User | null;
};

export default function ScrollAreaExplorer({ userData }: Props) {
  const { posts: postsContext, filters } = useFeed();

  // Group posts by filters
  function groupPostsByFilters(
    postsContext: { [key: number]: any },
    filters: { [key: number]: string }
  ): { [key: string]: Array<{ post: any; user: any; book: any; categories: any }> } {
    const result: { [key: string]: Array<{ post: any; user: any; book: any; categories: any }> } = {};
    Object.values(postsContext).forEach((postObj: any) => {
      postObj.filters.forEach((filterId: number) => {
        const filterName = filters[filterId];
        if (filterName) {
          if (!result[filterName]) {
            result[filterName] = [];
          }
          result[filterName].push({
            post: postObj.post,
            user: postObj.user,
            book: postObj.book,
            categories: postObj.filters,
          });
        }
      });
    });
    return result;
  }

  // Handle follow/unfollow button click
  const handleFollowClick = async (
    postUserId: number,
    isCurrentlyFollowing: boolean,
    currentUserId: number,
    updateFollowingState: (following: boolean) => void
  ) => {
    try {
      if (isCurrentlyFollowing) {
        const result = await unfollowUser(currentUserId, postUserId);
        if (result.status !== 200) throw new Error(result.message);
      } else {
        const result = await followUser(currentUserId, postUserId);
        if (result.status !== 200) throw new Error(result.message);
      }
      // Update the local state to reflect the change
      updateFollowingState(!isCurrentlyFollowing);
      // Update the following status in the post of PostContext
      postsContext[postUserId].user.following = !isCurrentlyFollowing;
        toast.success("Everything went well", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
          sonido: true,
        });

    } catch (error: any) {
        console.error("Failed to update following status", error);

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

  const groupedPosts = groupPostsByFilters(postsContext, filters);

  return (
    <div className="p-10">
      {Object.entries(groupedPosts).map(([filterName, posts_users]) => (
        <div key={filterName} className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">{filterName}</h2>
          {posts_users.length > 0 ? (
            <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
              <div className="flex gap-4">
                {posts_users.map((post_user) => {
                  const user = post_user.user;
                  const book = post_user.book;
                  const post = post_user.post;

                  const [following, setFollowing] = useState(user.following);

                  return (
                    <div>
                      {userData?.id !== user.id ? (
                        <Card
                        key={post.id}
                        className="h-110 md:w-96 w-72 flex-shrink-0 bg-gradient-to-br from-gray-900 to-blue-900 text-white shadow-xl"
                        >
                          <CardHeader className="flex-row items-center border-b border-blue-800 pb-4">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-10 h-10 border-2 border-blue-400">
                                <AvatarImage
                                  src={user ? `${baseUrl}/users/pfp/${user.id}` : "/logo.png"}
                                />
                                <AvatarFallback
                                  style={{
                                    backgroundColor: user?.username
                                      ? getColorFromInitials(user.username.substring(0, 2).toUpperCase())
                                      : "hsl(215, 100%, 50%)",
                                  }}
                                  className="text-white font-semibold text-sm flex items-center justify-center"
                                >
                                  {user?.username ? user.username.substring(0, 2).toUpperCase() : "?"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-semibold text-blue-300">
                                @{user?.username || "Unknown User"}
                              </span>
                              {userData ? (
                                <Button
                                  variant={following ? "default" : "outline"}
                                  className={`relative h-8 ${
                                    following ? "bg-gray-500" : "bg-blue-500"
                                  } text-white font-semibold py-2 px-4 rounded-l-md group`}
                                  onClick={() =>
                                    handleFollowClick(user.id, following, userData.id, setFollowing)
                                  }
                                >
                                  {following ? "Following" : "Follow"}
                                </Button>
                              ) : (
                                <div></div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="grid md:grid-cols-[150px_1fr] gap-4">
                              <Image
                                alt="Book cover"
                                className="rounded-lg object-cover shadow-md md:w-[250px] md:h-[250px]"
                                width={500}
                                height={500}
                                src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${book.id}.png` || "logo.png"}
                              />
                              <div className="space-y-3 whitespace-normal max-w-full overflow-hidden break-words">
                                <div>
                                  <h2 className="text-xl font-bold text-blue-200">{book?.title}</h2>
                                  <p className="text-blue-400">by {book?.author}</p>
                                </div>
                                <p className="text-sm text-gray-300">{post.description}</p>
                                <div className="flex flex-wrap gap-2 self-end">
                                  {post_user.categories &&
                                    post_user.categories.map((id: number) => (
                                      <Badge
                                        key={id}
                                        variant="secondary"
                                        className="bg-gradient-to-br from-blue-100 via-gray-200 to-blue-400 p-1 hover:bg-gradient-to-br hover:from-gray-700 hover:via-blue-500 hover:to-gray-200"
                                      >
                                        {filters[id]}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : 
                        <div></div>
                      }
                      
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No posts available</p>
          )}
        </div>
      ))}
    </div>
  );
}

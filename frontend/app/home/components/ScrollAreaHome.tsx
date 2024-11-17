import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Post } from "@/app/types/Post";
import "../style.css";
import NoPostError from "@/app/home/Errors/NoPostError";
import { useEffect, useState } from "react";
import { User } from "@/app/types/User";
import FetchError from "@/components/FetchError";
import { fetchUser, isUserFollowing } from "@/app/actions";

type Props = {
  userData: User;
  posts: Post[] | null;
};

export default function ScrollAreaHome({ userData, posts }: Props) {
  const currentUserId = userData.id;

  // State to hold other users' data and following status
  const [postUsersData, setPostUsersData] = useState<{
    [key: number]: { user: User; isFollowing: boolean };
  }>({});

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (posts && currentUserId) {
      const fetchUserData = async () => {
        try {
          const usersMap: {
            [key: number]: { user: User; isFollowing: boolean };
          } = {};

          await Promise.all(
            posts.map(async (post) => {
                // Fetch the post author's data
                const user = await fetchUser(post.user_id);

                // If no user is found, skip processing this post
                if (!user) {
                    console.warn(`User with ID ${post.user_id} not found.`);
                    return;
                }

                // Check if the current user is following the post author
                const isFollowing = await isUserFollowing(currentUserId, post.user_id) ?? false;

                console.log(
                    `Current user is ${isFollowing ? "following" : "not following"} the post author.`
                );

                // Add to usersMap only if user exists
                usersMap[post.user_id] = { user, isFollowing };
            })
          );

          setPostUsersData(usersMap);
        } catch (error) {
          console.error("Failed to fetch user data", error);
          setError("Failed to fetch user data");
        }
      };

      fetchUserData();
    }
  }, [posts, currentUserId]);

  if (!posts) {
    return <div className="flex-1 overflow-hidden pt-5">Loading...</div>;
  }

  return (
    <div className="flex-1 overflow-hidden pt-5">
      <ScrollArea className="h-[calc(100vh-64px)] w-full">
        <div className="p-4 space-y-4">
          {posts.length === 0 || error ? (
            error ? (
              <FetchError />
            ) : (
              <NoPostError />
            )
          ) : (
            posts.map((post: Post) => {
              const userInfo = postUsersData[post.user_id];
              const user = userInfo?.user;
              const isFollowing = userInfo?.isFollowing;

              return (
                <Card key={post.id} className="mx-20 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="flex-row items-center">
                    <div className="flex items-center gap-2 space-x-2 img-hero transition-transform cursor-pointer">
                      <Avatar className="avatar rounded-full">
                        {/* User's profile image */}
                        <AvatarImage
                          src={
                            user
                              ? `http://127.0.0.1/8000/users/pfp/${user.id}`
                              : "/book-signup.jpg"
                          }
                        />
                        <AvatarFallback>User</AvatarFallback>
                      </Avatar>
                      <span className="pl-1 text-transparent bg-clip-text bg-gradient-to-br from-blue-200 to-blue-950">
                        @{user?.username || "Unknown User"}
                      </span>
                      {/* Display Follow button if the post isn't by the current user */}
                      {currentUserId !== post.user_id && (
                        <Button
                          variant={isFollowing ? "default" : "outline"}
                          className={`relative h-8 ${
                            isFollowing ? "bg-gray-500" : "bg-blue-500"
                          } text-white font-semibold py-2 px-4 rounded-l-md group`}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-[200px_1fr] gap-4">
                      {/* Book image */}
                      <Image
                        alt="Book cover"
                        className="rounded-lg object-cover"
                        width={150}
                        height={190}
                        src="/book.jpg"
                      />
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            Title: Name of the Book
                          </h2>
                          <p className="text-gray-600">
                            Author: Owner&#39;s Name
                          </p>
                        </div>
                        <p className="text-sm text-gray-700">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit...
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5].map((tag) => (
                            <Badge key={tag} variant="secondary">
                              Tag {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/app/types/User";
import { getColorFromInitials } from "@/app/lib/colorHash";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {useFeed} from "@/contex/FeedContext";
import Image from 'next/image'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const NEXT_PUBLIC_STORAGE_BOOKS = process.env.NEXT_PUBLIC_STORAGE_BOOKS;

export default function ScrollAreaExplorer() {
  const { posts:postsContext,  filters } = useFeed();
  
  function groupPostsByFilters(
    postsContext: { [key: number]: any },
    filters: { [key: number]: string }
  ): { [key: string]: Array<{ post: any; user: any, book: any, categories: any }> } {
      const result: { [key: string]: Array<{ post: any; user: any, book: any, categories: any }> } = {};

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
                      categories: postObj.filters
                  });
              }
          });
      });

      return result;
  }

  const groupedPosts = groupPostsByFilters(postsContext, filters);
  console.log('ORIGINAL', postsContext);
  console.log('GROUP', groupedPosts);

  return (
    <div className="p-10">
      {Object.entries(groupedPosts).map(([filterName, posts_users]) => (
        <div key={filterName} className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">{filterName}</h2>
          {posts_users.length > 0 ? (
            <div>
              <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="flex gap-4">
                  {posts_users.map((post_user) => {
                    const user = post_user.user;
                    const book = post_user.book;
                    const post = post_user.post
                    return (
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
                                    ? getColorFromInitials(
                                        user.username.substring(0, 2).toUpperCase()
                                      )
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
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="grid md:grid-cols-[150px_1fr] gap-4">
                            <Image alt="Book cover" className="rounded-lg object-cover shadow-md md:w-[250px] md:h-[250px]"
                              width={500} height={500}
                              src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${book.id}.png` || 'logo.png'}/>
                            <div className="space-y-3 whitespace-normal max-w-full overflow-hidden break-words">
                              <div>
                                <h2 className="text-xl font-bold text-blue-200">{book?.title}</h2>
                                <p className="text-blue-400">by {book?.author}</p>
                              </div>
                              <p className="text-sm text-gray-300">{post.description}</p>
                              <div className="flex flex-wrap gap-2 self-end">
                                {post_user.categories && post_user.categories.map((id: number) => (
                                  <Badge key={id} variant="secondary"
                                      className="bg-gradient-to-br from-blue-100 via-gray-200 to-blue-400 p-1 hover:bg-gradient-to-br hover:from-gray-700 hover:via-blue-500 hover:to-gray-200">
                                    {filters[id]}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
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

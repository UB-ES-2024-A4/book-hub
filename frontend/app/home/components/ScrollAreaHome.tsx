import React, {Suspense, useEffect, useState} from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Heart, MessageCircle, Share2} from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import { Post } from "@/app/types/Post";
import "../style.css";
import NoPostError from "@/app/home/Errors/NoPostError";
import {User} from "@/app/types/User";
import {followUser, loadPosts, unfollowUser} from "@/app/actions";
import {getAccessToken} from "@/app/lib/authentication";
import {Book} from "@/app/types/Book";
import {useFeed} from "@/contex/FeedContext";
import {toast} from "nextjs-toast-notify";
import {getColorFromInitials} from "@/app/lib/colorHash";
import {PostStorage} from "@/app/types/PostStorage";
import {Input} from "@/components/ui/input";
import {X} from 'lucide-react'

type Props = {
  userData: User;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
// URL de la API de Azure Storage
const NEXT_PUBLIC_STORAGE_BOOKS = process.env.NEXT_PUBLIC_STORAGE_BOOKS;
const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;
const NEXT_PUBLIC_AZURE_SAS_STORAGE_BOOKS = process.env.NEXT_PUBLIC_AZURE_SAS_STORAGE_BOOKS;

export default function ScrollAreaHome({ userData }: Props) {

  const currentUserId = userData.id; console.log("USER ID", currentUserId);
  const { posts:postsContext,  addAllPosts, filters } = useFeed();

  // Handle follow/unfollow button click
  const handleFollowClick = async (
    postUserId: number,
    isCurrentlyFollowing: boolean
  ) => {

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


const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

  const handleFilterToggle = async (filterId: number) => {
      setSelectedFilters(prev =>
          prev.includes(filterId)
              ? prev.filter(id => id !== filterId)
              : [...prev, filterId]
      );
      // Call the API to get the posts with the selected filters
      // Load Post return an array of PostStorage
      // So, after loading the posts, we need to add them to the context
      // First we need to create an String of filters
      if(selectedFilters.includes(filterId)){
            const filters_ID = selectedFilters.filter((id) => id !== filterId).join(",");
            await reloadScrollPosts(filters_ID);
      }else {
          const filters_ID = filterId + ',' + selectedFilters.join(",");
          await reloadScrollPosts(filters_ID);
      }
  };

  const reloadScrollPosts = async (filters_ID: string) => {
      const result = await loadPosts(filters_ID);
      if (result.status !== 200) {
          console.error("Failed to load posts", result.message);
          // Show a toast notification
          toast.error(result.message, {
            duration: 4000, progress: true, position: "top-center", transition: "swingInverted",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n' +
                '  <circle cx="12" cy="12" r="10"/>\n' + '  <line x1="12" y1="8" x2="12" y2="12"/>\n' +
                '  <line x1="12" y1="16" x2="12.01" y2="16"/>\n' + '</svg>',
            sonido: true,});
          return;
      }else {
          if(result.data!=null)
            addAllPosts(result.data);
      }
  }
  const filteredFilters = Object.entries(filters)
    .filter(([_, filterName]) =>
      filterName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto">
            {/* Sección de Filtros */}
            <div className=" p-4 border-b rounded-t-lg pt-16 md:pt-4">
                <div className="mb-4">
                    <Input
                        placeholder="Search a Filter..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-white"
                    />
                </div>
                {/* Scroll Horizontal de Filtros */}
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex space-x-2 pb-2">
                        {filteredFilters.map(([id, filterName]) => (
                            <Badge
                                key={id}
                                onClick={() => handleFilterToggle(Number(id))}
                                className={`cursor-pointer hover:bg-blue-400 transition-colors text-gray-100 bg-gray-600
                                ${selectedFilters.includes(Number(id)) ? 
                                    'bg-gradient-to-br from-blue-100 via-gray-300 to-blue-400 text-black' : 
                                    ''}`}
                            >
                                {filterName}
                                {selectedFilters.includes(Number(id)) && (
                                    <X className="ml-2 w-4 h-4"/>
                                )}
                            </Badge>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
            </div>

            <div className="flex-1 overflow-hidden pt-5">
                <ScrollArea className="h-full w-full">
                    <div className=" gap-4 p-4">
                        {Object.keys(postsContext).length === 0 ? (
                                <NoPostError/>
                            )
                            : (
                                postsContext && Object.values(postsContext).map((post_I: PostStorage) => {
                                    const user = post_I.user;
                                    const book: Book = post_I.book;
                                    return (
                                        <Card key={post_I.post.id}
                                              className="max-w-7xl bg-gradient-to-br from-gray-900 to-blue-900 text-white shadow-xl col-span-1 mb-2">
                                            <CardHeader className="flex-row items-center border-b border-blue-800 pb-4">
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="w-10 h-10 border-2 border-blue-400">
                                                        <AvatarImage
                                                            src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}/${user.id}.png`}/>
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
                                                            variant={user.following ? "default" : "outline"}
                                                            className={`relative h-8 ${
                                                                user.following ? "bg-gray-500" : "bg-blue-500"
                                                            } text-white font-semibold py-2 px-4 rounded-l-md group`}
                                                            onClick={() =>
                                                                handleFollowClick(user.id, user.following)
                                                            }
                                                        >
                                                            {user.following ? "Following" : `Follow`}
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-4">
                                                <div
                                                    className="grid md:grid-cols-[150px_1fr] justify-items-center md:justify-items-start">
                                                    <Image alt="Book cover"
                                                           className="rounded-lg object-cover shadow-md mb-2 pr-4 hidden md:block"
                                                           width={200} height={200}
                                                           src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${book.id}.png`}
                                                    />
                                                    <div className="space-y-3">
                                                        <div>
                                                            <h2 className="text-xl font-bold text-blue-200">{book?.title}</h2>
                                                            <p className="text-blue-400">by {book?.author}</p>
                                                        </div>
                                                        <Image alt="Book cover"
                                                               className="rounded-lg object-cover shadow-md mb-2 md:hidden"
                                                               width={200} height={200}
                                                               src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${book.id}.png`}
                                                        />
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
                                            <CardFooter className="flex justify-between">
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
                                            </CardFooter>
                                        </Card>
                                    )
                                })
                            )
                        }
                    </div>
                </ScrollArea>
            </div>
        </div>
            );
            }

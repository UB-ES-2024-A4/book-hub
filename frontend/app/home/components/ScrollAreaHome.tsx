import React, { useEffect, useState } from "react";
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
import {fetchCommentsByPostID, followUser, loadPosts, unfollowUser} from "@/app/actions";
import {getAccessToken} from "@/app/lib/authentication";
import {Book} from "@/app/types/Book";
import {useFeed} from "@/contex/FeedContext";
import {toast} from "nextjs-toast-notify";
import {formatRelativeTime, getColorFromInitials} from "@/app/lib/hashHelpers";
import {PostStorage} from "@/app/types/PostStorage";
import {Input} from "@/components/ui/input";
import {X} from 'lucide-react'
import CommentsPreview from "@/app/home/components/CommentPreview";
import {AnimatePresence, motion} from "framer-motion";
import {CommentScroll} from "@/app/home/components/CommentScroll";
import {Dialog} from "@/components/ui/dialog";
import Link from "next/link";

type Props = {
  userData: User;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
// URL de la API de Azure Storage
const NEXT_PUBLIC_STORAGE_BOOKS = process.env.NEXT_PUBLIC_STORAGE_BOOKS;
const NEXT_PUBLIC_AZURE_SAS_STORAGE = process.env.NEXT_PUBLIC_AZURE_SAS_STORAGE;
const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;

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
  const [showComments, setShowComments] = useState(false);
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
                                                    <Link href={`/profile?userId=${user?.id}`}>
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
                                                    </Link>

                                                    <div className="flex flex-row space-x-10">
                                                        <div className="flex flex-col">
                                                            <Link href={`/profile?userId=${user?.id}`}>
                                                                <span className="font-semibold">{user.username}</span>
                                                            </Link>
                                                            <span className="text-xs text-gray-500">
                                                                {formatRelativeTime(post_I.post.created_at)}
                                                            </span>
                                                        </div>

                                                    {currentUserId != user?.id && (
                                                        <Button
                                                            variant={user.following ? "default" : "outline"}
                                                            className={` h-8  ${
                                                                user.following ? "bg-blue-500/10" : "bg-blue-500"
                                                            } text-white font-semibold py-2 px-4 rounded-l-md group`}
                                                            onClick={() =>
                                                                handleFollowClick(user.id, user.following)
                                                            }
                                                        >
                                                            {user.following ? "Following" : `Follow`}
                                                        </Button>
                                                    )}
                                                    </div>

                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-4">
                                                <div
                                                    className="grid md:grid-cols-[150px_1fr] lg:grid-cols-[200px_2fr_minmax(100px,300px)] xl:grid-cols-[200px_2fr_minmax(100px,400px)]
                                                    gap-4 items-start justify-items-center md:justify-items-start transition-all duration-500 ">
                                                    <Image alt="Book cover Big Screen"
                                                           className="rounded-lg object-cover shadow-md mb-2 hidden md:block"
                                                           width={400} height={400}
                                                           src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${book.id}.png`}
                                                    />
                                                    <div className="space-y-3">
                                                        <div>
                                                            <h2 className="text-xl font-bold text-blue-200">{book?.title}</h2>
                                                            <p className="text-blue-400">by {book?.author}</p>
                                                        </div>
                                                        <Image alt="Book cover Small Screen"
                                                               className="rounded-lg object-cover shadow-md mb-2 md:hidden"
                                                               width={400} height={400}
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
                                                    {/* Columna 3: Comentarios */}
                                                    <div className="max-w-[400px] lg:w-[300px] xl:w-[400px]">
                                                        <CommentsPreview comments={post_I.comments} n_comments={post_I.n_comments}
                                                                            postStorage={post_I}
                                                        />
                                                    </div>
                                                </div>

                                        {/* Mobile Comments Button */}
                                        <div className="block md:hidden">
                                            <button
                                                onClick={() => setShowComments(true)}
                                                className="flex items-center gap-2 text-blue-400 hover:text-blue-200 transition-colors"
                                            >
                                                <MessageCircle size={24} />
                                                <span>Comments ({post_I.comments.length})</span>
                                            </button>
                                        </div>

                                            <Dialog open={true}>
                                                <div
                                                    className={`pt-4 rounded-t-2xl w-full max-w-lg transition-all duration-500 transform ${
                                                        showComments ? 'translate-y-0' : ' hidden translate-y-full pointer-events-none'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-center mb-4">
                                                        <button
                                                            onClick={() => setShowComments(false)}
                                                            className="text-blue-400 hover:text-blue-200"
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                    <CommentScroll postsStorage={post_I} slice={false} smallWindow={true} />
                                                </div>
                                            </Dialog>

                                            </CardContent>
                                            {/*<CardFooter className="flex justify-between">
                                    <div className="flex gap-4">
                                      <Button variant="ghost">
                                        <Heart className="w-10 h-10 mr-2" />
                                        Like
                                      </Button>
                                        {/*<Button variant="ghost" size="sm">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                      </Button>
                                    </div>
                                  </CardFooter>*/}
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

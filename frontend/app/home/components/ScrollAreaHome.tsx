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
import React, {useEffect, useState} from "react";
import {User} from "@/app/types/User";
import FetchError from "@/components/FetchError";
import {getAccessToken} from "@/app/lib/authentication";
import {Book} from "@/app/types/Book";
import {useFeed} from "@/contex/FeedContext";

type Props = {
    posts: Post[] | null;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ScrollAreaHome() {
    const [userData, setUserData] = useState<{ [key: number]: User }>({});
    const [booksMap, setBooksMap] = useState<{ [key: number]: Book }>({});
    const [error, setError] = useState<string | null>(null);

    const { posts:postsContext, booksMap: booksContext, usersMap: usersContex,
        addBookToMap, addUserToMap
    } = useFeed();

    console.log("POSTS CONTEXT", postsContext);

    useEffect(() => {
        if ( postsContext) {
            console.log("POSTS CONTEXT", postsContext);
            postsContext.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            const fetchUserData = async () => {
                try {
                    const usersMap: { [key: number]: User } = {};
                    const booksMap: { [key: number]: Book } = {};

                    await Promise.all(
                        postsContext.map(async (post) => {
                            const response = await fetch(baseUrl + `/users/${post.user_id}`);
                            usersMap[post.user_id] = await response.json();
                            //const user = await response.json();
                            // Asegurar que el usuario no está duplicado
                            //if (!usersContex[post.user_id])
                              //  addUserToMap(post.user_id, user);

                            const bookResponse = await fetch(baseUrl + `/books/${post.book_id}`, {
                                method: "GET",
                                headers: {
                                    authorization: `Bearer ${ await getAccessToken() }` || "",
                                },
                            });
                            booksMap[post.book_id] = await bookResponse.json();
                            //const book = await bookResponse.json();
                            //if(!booksContext[post.book_id])
                              //  addBookToMap(post.book_id, book);
                        })
                    );

                    setUserData(usersMap);
                    setBooksMap(booksMap);
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                    setError(`Failed to fetch user data ${error}`); // Establece el estado de error
                }
            };

            fetchUserData();
            console.log("USERS MAP", userData);
            console.log("BOOKS MAP", booksMap);
        }
    }, [postsContext]);

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
                        const user: User = userData[post_I.user_id]
                        const book: Book = booksMap[post_I.book_id]
                        return (
                                <Card key={post_I.id} className="mx-auto max-w-4xl bg-gradient-to-br from-gray-900 to-blue-900 text-white shadow-xl">
                                    <CardHeader className="flex-row items-center border-b border-blue-800 pb-4">
                                        <div className="flex items-center space-x-2">
                                            <Avatar className="w-10 h-10 border-2 border-blue-400">
                                                <AvatarImage src={user? `${baseUrl}/users/pfp/${user.id}`: "/book-signup.jpg"} />
                                                <AvatarFallback>{user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-semibold text-blue-300">@{user?.username || "Unknown User"}</span>
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
                                {/* <CardFooter className="flex justify-between border-t border-blue-800 pt-4">
                                    <div className="flex gap-4">
                                        <Button variant="ghost" size="sm"
                                                className="text-blue-300 hover:text-blue-100 hover:bg-blue-800">
                                            <Heart className="w-4 h-4 mr-2"/>
                                            Like
                                        </Button>
                                        <Button variant="ghost" size="sm"
                                                className="text-blue-300 hover:text-blue-100 hover:bg-blue-800">
                                            <Share2 className="w-4 h-4 mr-2"/>
                                            Share
                                        </Button>
                                    </div>
                                    <Button variant="outline" size="sm"
                                            className="text-blue-300 border-blue-600 hover:bg-blue-800 hover:text-blue-100">
                                        <MessageCircle className="w-4 h-4 mr-2"/>
                                        Comment
                                    </Button>
                                </CardFooter>*/}

                            </Card>
                        )
                    })
                      )}
                </div>
            </ScrollArea>
        </div>
    );
}

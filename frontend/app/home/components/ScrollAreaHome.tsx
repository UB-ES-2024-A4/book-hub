import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Post } from "@/app/types/Post";
import "../style.css";
import NoPostError from "@/app/home/Errors/NoPostError";
import {useEffect, useState} from "react";
import {User} from "@/app/types/User";
import FetchError from "@/components/FetchError";

type Props = {
    posts: Post[] | null;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ScrollAreaHome({ posts }: Props) {
    const [userData, setUserData] = useState<{ [key: number]: User }>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (posts) {
            const fetchUserData = async () => {
                try {
                    const usersMap: { [key: number]: User } = {};

                // Itera sobre los posts y obtiene los datos de usuario correspondientes
                await Promise.all(
                    posts.map(async (post) => {
                        const response = await fetch(baseUrl + `/users/${post.user_id}`);
                        const user = await response.json();
                        usersMap[post.user_id] = user;
                    })
                );

                    setUserData(usersMap);
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                    setError("Failed to fetch user data"); // Establece el estado de error
                }
            };

            fetchUserData();
        }
    }, [posts]);

    if (!posts) {
        return <div className="flex-1 overflow-hidden pt-5">Loading...</div>;
    }


    return (
        <div className="flex-1 overflow-hidden pt-5">
            <ScrollArea className="h-[calc(100vh-64px)] w-full">
                <div className="p-4 space-y-4">
                    { posts.length === 0 || error ? (
                        error ? (
                            <FetchError />
                            ) : (
                            <NoPostError />)
                    ) : (
                        // Renderizado de los posts si están disponibles
                        posts.map((post: Post) => {
                            const user = userData[post.user_id];
                            return (
                            <Card key={post.id} className="mx-20 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="flex-row items-center">
                                    <div className="flex items-center space-x-2 img-hero transition-transform cursor-pointer">
                                        <Avatar className="avatar rounded-full">
                                            {/* Imagen de perfil del usuario */}
                                            <AvatarImage src={user? `${baseUrl}/users/pfp/${user.id}`: "/book-signup.jpg"} />
                                            <AvatarFallback>User</AvatarFallback>
                                        </Avatar>
                                        <span className="pl-1 text-transparent bg-clip-text bg-gradient-to-br from-blue-200 to-blue-950">
                                             @ {user?.username || "Unknown User"}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-[200px_1fr] gap-4">
                                        {/* Imagen del libro */}
                                        <Image
                                            alt="Book cover"
                                            className="rounded-lg object-cover"
                                            width={150}
                                            height={190}
                                            src="/book.jpg"
                                        />
                                        <div className="space-y-4">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800">Title: Name of the Book</h2>
                                                <p className="text-gray-600">Author: Owner&#39;s Name</p>
                                            </div>
                                            <p className="text-sm text-gray-700">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit...
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

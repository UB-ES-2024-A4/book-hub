import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, Search} from "lucide-react"
import Image from "next/image"
import Header from "@/components/Header";
import "./style.css"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-200 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden pt-10">
        {/* Sidebar (Search) */}
        <div className="w-1/4 border-r shadow-black shadow-2xl p-4 flex flex-col">
          <div className="sticky top-0 pt-10">
            <div className="relative">
              <Input className="w-full pl-8 text-white bg-blue-900/50" placeholder="Search User" />
              <Search className="absolute top-3 left-2 w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Feed Section */}
        <div className="flex-1 overflow-hidden pt-5">
          <ScrollArea className="h-[calc(100vh-64px)] w-full">
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((post) => (
                <Card key={post} className="mx-20 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="flex-row items-center">
                    <div className="flex items-center space-x-2 img-hero transition-transform cursor-pointer">
                      <Avatar className="avatar rounded-full "
                         >
                        <AvatarImage src="/book-signup.jpg"/>
                        <AvatarFallback>User</AvatarFallback>
                      </Avatar>
                      <span className="pl-1 text-transparent bg-clip-text bg-gradient-to-br from-blue-200 to-blue-950">
                        @ Username {post}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="">
                    <div className="grid md:grid-cols-[200px_1fr]">
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
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                          et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
                  {/* <CardFooter className="flex justify-between">
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
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
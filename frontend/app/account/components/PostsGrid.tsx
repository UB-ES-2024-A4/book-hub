// app/account/components/PostsGrid.tsx
'use client';

import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';
import PostDialog from "@/app/account/components/PostDialog";
import React, {useState} from "react";
import {Post} from "@/app/types/Post";
import {PropsUser} from "@/app/types/PropsUser";

const userPosts = [
  {
    id: 1,
    title: "Name of the Book",
    author: "Author's Name",
    coverImage: "/book.jpg",
    tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"],
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    likes: 15,
    comments: 3,
  },
  {
    id: 2,
    title: "Name of the Book",
    author: "Author's Name",
    coverImage: "/book.jpg",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["Tag1", "Tag2", "Tag3"],
    likes: 30,
    comments: 8,
  },
];



export default function PostsGrid( {userData}: PropsUser ) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const openPostDialog = (post: Post) => {
    setSelectedPost(post)
  }
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
        {userPosts.map((post) => (
            <div key={post.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <Image src={userData.profilePicture || "/book.jpeg"} alt={userData.fullName} width={40} height={40}
                         className="w-10 h-10 rounded-full mr-3"/>
                  <span className="font-semibold">{userData.username}</span>
                </div>
                <Image
                    src={post.coverImage || "/book.jpeg"}
                    alt={post.title} width={500} height={500}
                    className="w-full h-48 object-cover mb-4 cursor-pointer"
                    onClick={() => openPostDialog(post)}
                />
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{post.author}</p>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <button className="flex items-center">
                    <Heart className="w-4 h-4 mr-1"/> {post.likes}
                  </button>
                  <button className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1"/> {post.comments} comments
                  </button>
                </div>
              </div>
            </div>
        ))}
      <PostDialog selectedPost={selectedPost} setSelectedPost={setSelectedPost}/>
      </div>


)
  ;
}

// app/account/components/PostsGrid.tsx
'use client';

import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';
import PostDialog from "@/app/account/components/Dialogs/PostDialog";
import React, {useState} from "react";
import {Post} from "@/app/types/Post";
import {User} from "@/app/types/User";

const userPosts = [
  {
    id: 1,
    title: "Name of the Book",
    author: "Author's Name",
    coverImage: "/book.jpg",
    tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"],
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    likes: 15,  comments: 3, book_id: 1, user_id: 1,  created_at: "",   description: "",

  },
  {
    id: 2,
    title: "Name of the Book",
    author: "Author's Name",
    coverImage: "/book.jpg",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["Tag1", "Tag2", "Tag3"],
    likes: 30,    comments: 8, book_id: 1, user_id: 1,  created_at: "",  description: "",
  },
  {
    id: 2,
    title: "Name of the Book",
    author: "Author's Name",
    coverImage: "/book.jpg",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["Tag1", "Tag2", "Tag3"],
    likes: 30,  comments: 8, book_id: 1,  user_id: 1,  created_at: "",  description: "",
  },
  {
    id: 2,
    title: "Name of the Book",
    author: "Author's Name",
    coverImage: "/book.jpg",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["Tag1", "Tag2", "Tag3"],
    likes: 30, comments: 8,  book_id: 1,  user_id: 1, created_at: "", description: "",
  },
  {
    id: 2,
    title: "Name of the Book",
    author: "Author's Name",
    coverImage: "/book.jpg",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["Tag1", "Tag2", "Tag3"],
    likes: 30,  comments: 8,book_id: 1, user_id: 1, created_at: "", description: "",
  },
];

type Props = {
    userData: User;
}

export default function PostsGrid( {userData}: Props ) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const openPostDialog = (post: Post) => {
    setSelectedPost(post)
  }
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
        {userPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg overflow-hidden
            shadow-blue-700 shadow-sm hover:shadow-blue-700 hover:shadow-md cursor-pointer"
            onClick={() => openPostDialog(post)}>
              <div className="p-4">{/*
                <div className="flex items-center mb-4">
                  <Image src={userData.profilePicture || "/book.jpeg"} alt={userData.fullName} width={40} height={40}
                         className="w-10 h-10 rounded-full mr-3"/>
                  <span className="font-semibold">{userData.username}</span>
                </div>*/}
                <Image
                    src={post.coverImage || "/book.jpeg"}
                    alt={post.title} width={500} height={500}
                    className="w-full h-48 object-cover mb-4 cursor-pointer"
                />
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{post.author}</p>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1 text-red-600 fill-current"/> {post.likes}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1 fill-current"/> {post.comments} comments
                  </div>
                </div>
              </div>
            </div>
        ))}
      <PostDialog selectedPost={selectedPost} setSelectedPost={setSelectedPost}/>
      </div>


)
  ;
}
// app/account/components/PostsGrid.tsx
'use client';

import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';
import PostDialog from "@/app/account/components/Dialogs/PostDialog";
import React, {useState} from "react";
import {Post} from "@/app/types/Post";
import { PropsUser } from '@/app/types/PropsUser';

const userPosts = [
  {
    id: 1,
    likes: 15,
    book_id: 1,
    user_id: 1,
    created_at: "",
    description: "",
    filter_ids: [{id: 1, name: "Tag1"}, {id: 2, name: "Tag2"}]
  },
  {
    id: 2,
    title: "Name of the Book",
    likes: 30,
    book_id: 1,
    user_id: 1,
    created_at: "",
    description: "",
    filter_ids: [{id: 1, name: "Tag1"}, {id: 2, name: "Tag2"}]
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
                    src="/book.jpeg"
                    alt="Title" width={500} height={500}
                    className="w-full h-48 object-cover mb-4 cursor-pointer"
                />
                <h3 className="font-bold text-lg mb-2"> Title</h3>
                <p className="text-sm text-gray-600 mb-2"> Author </p>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1 text-red-600 fill-current"/> {post.likes}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1 fill-current"/> 10 comments
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
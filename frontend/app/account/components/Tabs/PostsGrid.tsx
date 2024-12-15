// app/account/components/PostsGrid.tsx
'use client';

import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';
import PostDialog from "@/app/account/components/Dialogs/PostDialog";
import React, {useState} from "react";
import {Post} from "@/app/types/Post";
import {PostStorage, UserUnic} from "@/app/types/PostStorage";
import {useFeed} from "@/contex/FeedContext";
import PostsPreviewHome from "@/app/home/components/PostsPreviewHome";
import {Filter} from "@/app/types/Filter";

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
      {
    id: 4,
    title: "Name of the Book",
    likes: 30,
    book_id: 1,
    user_id: 1,
    created_at: "",
    description: "",
    filter_ids: [{id: 1, name: "Tag1"}, {id: 2, name: "Tag2"}]
  },
      {
    id: 10,
    title: "Name of the Book",
    likes: 30,
    book_id: 1,
    user_id: 1,
    created_at: "",
    description: "",
    filter_ids: [{id: 1, name: "Tag1"}, {id: 2, name: "Tag2"}]
  },
];
// Dummy data
//    user: UserUnic
//     post: Post
//     book: Book;
//     filters: number[]
//     like_set: boolean
//     n_comments: number
//     comments: CommentUnic[]
const postStorageDummy = {
    user: {
        username: "username",
        id: 1,
        following: false
    },
    post: {
        id: 1,
        likes: 15,
        book_id: 1,
        user_id: 1,
        created_at: "",
        description: "",
        filter_ids: [{id: 1, name: "Tag1"}, {id: 2, name: "Tag2"}]
    },
    book: {
      id: 1,
      title: "Name of the Book",
      author: "Author",
      description: "Description of the book",
      created_at: "",
    },
    filters: [1, 2],
    like_set: false,
    n_comments: 10,
    comments: [
        {
                id: 1,
                created_at: new Date(),
                comment: "This is a comment",
                user: {
                    username: "Soliam",
                    id: 3,
                    following: false
                }
        },
        ]
}



type PostsGridProps = {
  posts: PostStorage[];
}

export default function PostsGrid( ) {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const {userLogin} = useFeed();
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = (post_ID: number) => {
      setSelectedPost(post_ID);
      setIsDialogOpen(true);
  };

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 pb-8">
          {userPosts.map((post) => (
              <div
                  key={post.id}
                  className="relative group overflow-hidden rounded-lg"
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                  onClick={() => {
                      openDialog(post.id)
                  }}
              >
                  {/* Image always visible */}
                  <div className="flex justify-center">
                      <Image
                          src="/detective-book.png"
                          alt={postStorageDummy.book.title}
                          width={500}
                          height={500}
                          className="w-full h-auto object-cover cursor-pointer"
                      />
                  </div>

                  {/* Hover overlay */}
                  {hoveredPost === post.id && (
                      <div
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center
                          justify-center transition-all duration-300 ease-in-out  cursor-pointer">
                          <div className="flex items-center text-white space-x-4">
                              <div className="flex items-center">
                                  <Heart className="w-6 h-6 mr-2 text-white fill-current"/>
                                  <span className="text-lg font-semibold">{post.likes}</span>
                              </div>
                              <div className="flex items-center">
                                  <MessageCircle className="w-6 h-6 mr-2 text-white fill-current"/>
                                  <span className="text-lg font-semibold">10</span>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          ))}

          <PostsPreviewHome
              open={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              postsStorage={postStorageDummy}
          />
      </div>
  )
      ;
}
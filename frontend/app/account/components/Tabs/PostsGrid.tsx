// app/account/components/PostsGrid.tsx
'use client';

import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';
import React, {useState} from "react";
import {PostStorage, UserUnic} from "@/app/types/PostStorage";
import {useFeed} from "@/contex/FeedContext";
import PostsPreviewHome from "@/app/home/components/PostsPreviewHome";

const NEXT_PUBLIC_STORAGE_BOOKS = process.env.NEXT_PUBLIC_STORAGE_BOOKS;

type PostsGridProps = {
  posts: PostStorage[] | null;
}

export default function PostsGrid({ posts }: PostsGridProps) {
    const { posts: postsContext } = useFeed();

    const [selectedPost, setSelectedPost] = useState<number>(1);
    const [hoveredPost, setHoveredPost] = useState<number | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = (post_ID: number) => {
      setSelectedPost(post_ID);
      setIsDialogOpen(true);
    };
      
    if (!posts) {
        return (
            <div className="col-span-full text-center text-gray-500">
                No posts to display
            </div>
        );
    }
    

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 pb-8">
        {posts.length===0 ? (
          <div className="col-span-full text-center text-gray-500">
            No posts to display
          </div>
        ) : (
            posts.map((post, index) => (
              <div
                  key={post.post.id}
                  className="relative group overflow-hidden rounded-lg"
                  onMouseEnter={() => setHoveredPost(post.post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                  onClick={() => {
                      openDialog(index);
                  }}
              >
                  {/* Image always visible */}
                  <div className="flex justify-center items-center h-full bg-gray-300">
                      <Image
                          src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${post.book.id}.png`}
                          alt={post.book.title}
                          width={500}
                          height={500}
                          className="object-contain cursor-pointer"
                      />
                  </div>

                  {/* Hover overlay */}
                  {hoveredPost === post.post.id && (
                      <div
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center
                          justify-center transition-all duration-300 ease-in-out  cursor-pointer">
                          <div className="flex items-center text-white space-x-4">
                              <div className="flex items-center">
                                  <Heart className="w-6 h-6 mr-2 text-white fill-current"/>
                                  <span className="text-lg font-semibold">{post.post.likes}</span>
                              </div>
                              <div className="flex items-center">
                                  <MessageCircle className="w-6 h-6 mr-2 text-white fill-current"/>
                                  <span className="text-lg font-semibold">{post.n_comments}</span>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
            ))
        )}

          <PostsPreviewHome
              open={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              postsStorage={posts[selectedPost]}
          />
      </div>
  )
      ;
}
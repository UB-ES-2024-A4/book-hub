'use client';

import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';
import React, { useState } from "react";
import { PostStorage } from "@/app/types/PostStorage";
import { useFeed } from "@/contex/FeedContext";
import PostsPreviewHome from "@/app/home/components/PostsPreviewHome";

const NEXT_PUBLIC_STORAGE_BOOKS = process.env.NEXT_PUBLIC_STORAGE_BOOKS;

type PostsGridProps = {
  posts: PostStorage[] | null;
}

export default function PostsGrid({ posts }: PostsGridProps) {
  const { posts: postsContext } = useFeed();

  const [selectedPost, setSelectedPost] = useState<PostStorage | null>(null);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = (post: PostStorage) => {
   // const updatedPostsStorage = JSON.parse(JSON.stringify(post));
    //setSelectedPost(updatedPostsStorage); // Guarda directamente el post seleccionado
    //setIsDialogOpen(true);
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="col-span-full text-center text-gray-500">
        No posts to display
      </div>
    );
  }

  return (
    <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 pb-8">
        {posts.map((post) => (
            <div
            key={post.post.id}
            className="relative group overflow-hidden rounded-lg"
            onMouseEnter={() => setHoveredPost(post.post.id)}
            onMouseLeave={() => setHoveredPost(null)}
            onClick={() => openDialog(post)} // Envía el post completo
            >
          <div className="flex justify-center items-center h-full bg-gray-300">
            <Image
              src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${post.book.id}.png`}
              alt={post.book.title}
              width={500}
              height={500}
              className="object-contain cursor-pointer"
            />
          </div>

          {hoveredPost === post.post.id && (
            <div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
            >
              <div className="flex items-center text-white space-x-4">
                <div className="flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-white fill-current" />
                  <span className="text-lg font-semibold">{post.post.likes}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2 text-white fill-current" />
                  <span className="text-lg font-semibold">{post.n_comments}</span>
                </div>
              </div>
            </div>
          )}               
        </div>
      ))}

        </div>
        
        {/*{selectedPost && (
            <PostsPreviewHome
            open={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            postsStorage={{ ...selectedPost}} // Envía el post seleccionado
            />
        )}*/}  
    </div>
  );
}

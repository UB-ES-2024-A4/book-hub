'use client';

import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';
import React, {useState} from "react";
import {PostStorage} from "@/app/types/PostStorage";
import {useFeed} from "@/contex/FeedContext";
import PostsPreviewHome from "@/app/home/components/PostsPreviewHome";

const NEXT_PUBLIC_STORAGE_BOOKS = process.env.NEXT_PUBLIC_STORAGE_BOOKS;

type PostsGridProps = {
  postsUser: PostStorage[] | undefined;
}

export default function PostsGrid( { postsUser }: PostsGridProps ) {
  const [selectedPost, setSelectedPost] = useState<number>(0);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const { posts: postsContext } = useFeed();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = (post_ID: number) => {
      setSelectedPost(post_ID);
      setIsDialogOpen(true);
  };

  if (!postsUser) {
    return (
        <div className="col-span-full text-center text-gray-500">
            No posts to display
        </div>
    );
}

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 pb-8">
        {postsUser?.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No posts to display
          </div>
        ) : (
            postsUser?.map((object, index) => (
              <div
                  key={object.post.id}
                  className="relative group overflow-hidden rounded-lg"
                  onMouseEnter={() => setHoveredPost(object.post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                  onClick={() => {
                      openDialog(index)
                  }}
              >
                  <div className="flex justify-center items-center h-full bg-gray-200">
                      <Image
                        src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${object.book.id}.png`}
                        alt={object.book.title}
                        width={200}
                        height={200}
                        className="h-auto object-contain cursor-pointer"
                      />
                  </div>

                  {hoveredPost === object.post.id && (
                      <div
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center
                          justify-center transition-all duration-300 ease-in-out  cursor-pointer">
                          <div className="flex items-center text-white space-x-4">
                              <div className="flex items-center">
                                  <Heart className="w-6 h-6 mr-2 text-white fill-current"/>
                                  <span className="text-lg font-semibold">{object.post.likes}</span>
                              </div>
                              <div className="flex items-center">
                                  <MessageCircle className="w-6 h-6 mr-2 text-white fill-current"/>
                                  <span className="text-lg font-semibold">{object.n_comments}</span>
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
              postsStorage={postsUser[selectedPost]}
          />

      </div>
  );
}

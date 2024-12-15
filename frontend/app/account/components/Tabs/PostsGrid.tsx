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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const {userLogin} = useFeed();

  const openPostDialog = (post: Post) => {
    setSelectedPost(post)
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
        {userPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg overflow-hidden
            shadow-blue-700 shadow-sm hover:shadow-blue-700 hover:shadow-md cursor-pointer"
            onClick={() =>openDialog()}>
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <span className="font-semibold">{userLogin?.username}</span>
                </div>
                <Image
                    src="/logo.png"
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
        {/*<PostDialog selectedPost={selectedPost} setSelectedPost={setSelectedPost}/>*/}

        <PostsPreviewHome open={isDialogOpen} setIsDialogOpen={setIsDialogOpen} postsStorage={postStorageDummy} />
</div>
)
  ;
}
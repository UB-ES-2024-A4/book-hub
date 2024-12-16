// app/account/components/Tabs.tsx
'use client';

import { useState } from 'react';
import PostsGrid from './Tabs/PostsGrid';
import {PropsUser} from "@/app/types/PropsUser";
import {PostStorage} from "@/app/types/PostStorage";

type Props = {
  postsUser: PostStorage[] | null,
  postsLiked: PostStorage[] | null
}
export default function Tabs({ postsUser, postsLiked }: Props) {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="container px-8 bg-[#051B32]">
      <div className="py-2">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#4066cf]"></div>
          </div>
        </div>
      </div>
        <nav className="flex space-x-8 mb-8">
          {/*<button
              onClick={() => setActiveTab('posts')}
              className={`path text-gray-600 transition-colors duration-300 
              ${activeTab === 'posts' ? 'active' : ''}`}
          >
            Posts
          </button>*/}
          <button
              onClick={() => setActiveTab('postsLiked')}
              className={`path text-gray-600 transition-colors duration-300 
              ${activeTab === 'postsLiked' ? 'active' : ''}`}
          >
            Liked
          </button>
        </nav>
      {/*{activeTab === 'posts' && <PostsGrid   />}*/}
      {activeTab === 'postsLiked' && <PostsGrid   />}

    </div>
  );
}

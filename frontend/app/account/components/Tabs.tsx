// app/account/components/Tabs.tsx
'use client';

import { useState } from 'react';
import PostsGrid from './PostsGrid';
import SavedPostsList from './SavedPostsList';
import {PropsUser} from "@/app/types/PropsUser";


export default function Tabs({ userData }: PropsUser) {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="container px-8">
      <div className="py-2">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#4066cf]"></div>
          </div>
        </div>
      </div>
        <nav className="flex space-x-8 mb-8">
          <button
              onClick={() => setActiveTab('posts')}
              className={`path text-gray-600 transition-colors duration-300 
              ${activeTab === 'posts' ? 'active' : ''}`}
          >
            Posts
          </button>
          <button
              onClick={() => setActiveTab('booklist')}
              className={`path text-gray-600 transition-colors duration-300 
              ${activeTab === 'booklist' ? 'active' : ''}`}
          >
            Book List
          </button>
        </nav>

      {activeTab === 'posts' && <PostsGrid userData={userData}/>}
      {activeTab === 'booklist' && <SavedPostsList/>}

    </div>
  );
}
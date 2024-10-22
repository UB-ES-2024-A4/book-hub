'use client'

import React, { useState } from 'react'
import { Edit2 , MessageCircle,  Heart } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/Header";
import Image from "next/image";
import PostDialog from "@/components/PostDialog";
import ProfileDialog from "@/components/ProfileDialog";

// Mock data for demonstration
const userDataMock = {
  fullName: "Penny Smith",
  username: "pennyreads",
  email: "penny@example.com",
  bio: "Bookworm and coffee addict. Always looking for the next great read!",
  profilePicture: "/book.jpg",
  coverPhoto: "/book.jpg",
}
const userPosts = [
  {
    id: 1,
    title: "Name of the Book",
    author: "Author's Name",
    coverImage: "/book.jpg",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"],
    likes: 15,
    shares: 5,
    comments: 3,
  },
    {
    id: 2,
    title: "Name of the Book",
    author: "Author's Name",
    coverImage: "/book.jpg",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["Tag1", "Tag2", "Tag3"],
    likes: 34,
    comments: 3,
  }
  ]

const savedPosts = [
  { id: 1, content: "Top 10 Classic Novels Everyone Should Read", author: "bookworm42" },
  { id: 2, content: "Review: The latest bestseller that's taking the world by storm", author: "litcritic99" },
]

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(userDataMock)
  const [userData, setUserData] = useState(userDataMock)
  const [activeTab, setActiveTab] = useState('posts')
  type Post = {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  content: string;
  tags: string[];
  likes: number;
  shares?: number;
  comments: number;
};

const [selectedPost, setSelectedPost] = useState<Post | null>(null);


  const openPostDialog = (post: Post) => {
    setSelectedPost(post)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  return (
      <div className={"min-h-screen bg-gray-100 bg-gradient-to-br from-blue-950 to-blue-200"}>
        <Header></Header>

        <main className="container mx-auto pt-16 p-4 ">

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative">
              <img src={userData.coverPhoto} alt="Cover" className="w-full h-48 object-cover"/>
              <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-8">
                <img src={userData.profilePicture} alt={userData.fullName}
                     className="w-24 h-24 rounded-full border-4 border-white"/>
              </div>
            </div>
            <div className="pt-16 px-8 pb-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold">{userData.fullName}</h2>
                  <p className="text-gray-600">@{userData.username}</p>
                  <p className="mt-2">{userData.bio}</p>
                </div>
                <div className="space-x-2">
                  <Button>Follow</Button>
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit2 className="mr-2 h-4 w-4"/> Edit Profile
                  </Button>
                </div>
              </div>



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
                      className={`path text-gray-600 transition-colors duration-300 ${activeTab === 'posts' ? 'border-b-2 border-[#0000ff] !important' : ''}`}
                  >
                    Posts
                  </button>
                  <button
                      onClick={() => setActiveTab('booklist')}
                      className={`path text-gray-600 transition-colors duration-300 ${activeTab === 'booklist' ? 'text-[#00a062]' : ''}`}
                  >
                    Book List
                  </button>
                </nav>

                {activeTab === 'posts' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {userPosts.map((post) => (
                          <div key={post.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="p-4">
                              <div className="flex items-center mb-4">
                                <Image src={userData.profilePicture} alt={userData.fullName} width={40} height={40}
                                     className="w-10 h-10 rounded-full mr-3"/>
                                <span className="font-semibold">{userData.username}</span>
                              </div>
                              <Image
                                  src={post.coverImage}
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
                    </div>
                )}

              {activeTab === 'booklist' && (
                  <div className="space-y-4">
                    {savedPosts.length > 0 ? (
                        savedPosts.map(post => (
                            <div key={post.id} className="bg-gray-50 p-4 rounded-lg">
                              <p>{post.content}</p>
                              <p className="text-sm text-gray-600 mt-2">Posted by: {post.author}</p>
                            </div>
                        ))
                    ) : (
                        <p>You have not saved any posts yet.</p>
                    )}
                  </div>
              )}
            </div>
          </div>


        </main>
          <ProfileDialog isEditing={isEditing} setIsEditing={setIsEditing} editedUser={editedUser} setEditedUser={setEditedUser} setUserData={setUserData} />
          <PostDialog selectedPost={selectedPost} setSelectedPost={setSelectedPost} />
      </div>
  )
}
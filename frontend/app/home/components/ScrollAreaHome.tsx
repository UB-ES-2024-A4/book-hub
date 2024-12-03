import React, { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import NoPostError from '@/app/home/Errors/NoPostError';
import { useFeed } from '@/contex/FeedContext';
import { toast } from 'nextjs-toast-notify';
import { loadPosts, followUser, unfollowUser } from '@/app/actions';
import { PostCard } from '@/app/home/components/PostCard';
import { PostStorage } from '@/app/types/PostStorage';
import { User } from '@/app/types/User';

type Props = {
  userData: User;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
// URL of the Azure Storage API
const NEXT_PUBLIC_STORAGE_BOOKS = process.env.NEXT_PUBLIC_STORAGE_BOOKS;
const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;

export default function ScrollAreaHome({ userData }: Props) {
  const currentUserId = userData.id;
  console.log('USER ID', currentUserId);
  const { posts: postsContext, addAllPosts, filters } = useFeed();

  // Handle follow/unfollow button click
  const handleFollowClick = async (postUserId: number, isCurrentlyFollowing: boolean) => {
    try {
      if (isCurrentlyFollowing) {
        // Unfollow the user
        const result = await unfollowUser(currentUserId, postUserId);
        if (result.status !== 200) throw new Error(result.message);
      } else {
        const result = await followUser(currentUserId, postUserId);
        if (result.status !== 200) throw new Error(result.message);
      }
      // Update the following status in the post of PostContext
      postsContext[postUserId].user.following = !isCurrentlyFollowing;
      toast.success('Everything went well', {
        duration: 4000,
        progress: true,
        position: 'top-right',
        transition: 'bounceIn',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" ...></svg>',
        sonido: true,
      });
    } catch (error: any) {
      console.error('Failed to update following status', error);
      // Show a toast notification
      toast.error(error.message, {
        duration: 4000,
        progress: true,
        position: 'top-center',
        transition: 'swingInverted',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" ...></svg>',
        sonido: true,
      });
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

  const handleFilterToggle = async (filterId: number) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
    // Call the API to get the posts with the selected filters
    // Load Post returns an array of PostStorage
    // So, after loading the posts, we need to add them to the context
    // First, we need to create a string of filters
    const filters_ID = selectedFilters
      .includes(filterId)
      ? selectedFilters.filter((id) => id !== filterId).join(',')
      : [filterId, ...selectedFilters].join(',');
    await reloadScrollPosts(filters_ID);
  };

  const reloadScrollPosts = async (filters_ID: string) => {
    const result = await loadPosts(filters_ID);
    if (result.status !== 200) {
      console.error('Failed to load posts', result.message);
      // Show a toast notification
      toast.error(result.message, {
        duration: 4000,
        progress: true,
        position: 'top-center',
        transition: 'swingInverted',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" ...></svg>',
        sonido: true,
      });
      return;
    } else {
      if (result.data != null) addAllPosts(result.data);
    }
  };

  const filteredFilters = Object.entries(filters).filter(([_, filterName]) =>
    filterName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      {/* Filter Section */}
      <div className="p-4 border-b rounded-t-lg pt-16 md:pt-4">
        <div className="mb-4">
          <Input
            placeholder="Search a Filter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-white"
          />
        </div>
        {/* Horizontal Scroll of Filters */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-2">
            {filteredFilters.map(([id, filterName]) => (
              <Badge
                key={id}
                onClick={() => handleFilterToggle(Number(id))}
                className={`cursor-pointer hover:bg-blue-400 transition-colors text-gray-100 bg-gray-600 ${
                  selectedFilters.includes(Number(id))
                    ? 'bg-gradient-to-br from-blue-100 via-gray-300 to-blue-400 text-black'
                    : ''
                }`}
              >
                {filterName}
                {selectedFilters.includes(Number(id)) && <X className="ml-2 w-4 h-4" />}
              </Badge>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex-1 overflow-hidden pt-5">
        <ScrollArea className="h-full w-full">
          <div className="gap-4 p-4">
            {Object.keys(postsContext).length === 0 ? (
              <NoPostError />
            ) : (
              postsContext &&
              Object.values(postsContext).map((post_I: PostStorage) => (
                <PostCard
                  key={post_I.post.id}
                  postStorage={post_I}
                  currentUserId={currentUserId}
                  handleFollowClick={handleFollowClick}
                  filters={filters}
                  NEXT_PUBLIC_STORAGE_PROFILE_PICTURES={NEXT_PUBLIC_STORAGE_PROFILE_PICTURES!}
                  NEXT_PUBLIC_STORAGE_BOOKS={NEXT_PUBLIC_STORAGE_BOOKS!}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

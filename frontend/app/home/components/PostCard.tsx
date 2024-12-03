import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';
import { PostStorage } from '@/app/types/PostStorage';
import { getColorFromInitials } from '@/app/lib/colorHash';
import { likePost, unlikePost } from '@/app/actions';
import { toast } from 'nextjs-toast-notify';

type Props = {
  postStorage: PostStorage;
  currentUserId: number;
  handleFollowClick: (postUserId: number, isCurrentlyFollowing: boolean) => void;
  filters: Record<number, string>;
  NEXT_PUBLIC_STORAGE_PROFILE_PICTURES: string;
  NEXT_PUBLIC_STORAGE_BOOKS: string;
};

export function PostCard({
  postStorage,
  currentUserId,
  handleFollowClick,
  filters,
  NEXT_PUBLIC_STORAGE_PROFILE_PICTURES,
  NEXT_PUBLIC_STORAGE_BOOKS,
}: Props) {
  const { user, post, book, filters: postFilters } = postStorage;

  const [liked, setLiked] = useState(postStorage.like_set);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLikeClick = async () => {
    // Optimistically update the UI
    const prevLiked = liked;
    const prevLikesCount = likesCount;

    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    // Call the backend API to like/unlike the post
    try {
      if (liked) {
        // Unlike the post
        const result = await unlikePost(currentUserId, post.id);
        if (result.status !== 200) {
          throw new Error(result.message);
        }
      } else {
        // Like the post
        const result = await likePost(currentUserId, post.id);
        if (result.status !== 200) {
          throw new Error(result.message);
        }
      }
    } catch (error: any) {
      // Revert the UI changes if there's an error
      setLiked(prevLiked);
      setLikesCount(prevLikesCount);
      console.error('Failed to update like status', error);

      // Show a toast notification
      toast.error(error.message, {
        duration: 4000,
        progress: true,
        position: 'top-center',
        transition: 'swingInverted',
      });
    }
  };

  return (
    <Card
      key={post.id}
      className="max-w-7xl bg-gradient-to-br from-gray-900 to-blue-900 text-white shadow-xl col-span-1 mb-2"
    >
      <CardHeader className="flex-row items-center border-b border-blue-800 pb-4">
        <div className="flex items-center space-x-2">
          <Avatar className="w-10 h-10 border-2 border-blue-400">
            <AvatarImage src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}/${user.id}.png`} />
            <AvatarFallback
              style={{
                backgroundColor: user?.username
                  ? getColorFromInitials(user.username.substring(0, 2).toUpperCase())
                  : 'hsl(215, 100%, 50%)',
              }}
              className="text-white font-semibold text-sm flex items-center justify-center"
            >
              {user?.username ? user.username.substring(0, 2).toUpperCase() : '?'}
            </AvatarFallback>
          </Avatar>

          <span className="font-semibold text-blue-300">@{user?.username || 'Unknown User'}</span>
          {currentUserId != user?.id && (
            <Button
              variant={user.following ? 'default' : 'outline'}
              className={`relative h-8 ${
                user.following ? 'bg-gray-500' : 'bg-blue-500'
              } text-white font-semibold py-2 px-4 rounded-l-md group`}
              onClick={() => handleFollowClick(user.id, user.following)}
            >
              {user.following ? 'Following' : `Follow`}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid md:grid-cols-[150px_1fr] justify-items-center md:justify-items-start">
          <Image
            alt="Book cover"
            className="rounded-lg object-cover shadow-md mb-2 pr-4 hidden md:block"
            width={200}
            height={200}
            src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${book.id}.png`}
          />
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-bold text-blue-200">{book?.title}</h2>
              <p className="text-blue-400">by {book?.author}</p>
            </div>
            <Image
              alt="Book cover"
              className="rounded-lg object-cover shadow-md mb-2 md:hidden"
              width={200}
              height={200}
              src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${book.id}.png`}
            />
            <p className="text-sm text-gray-300">{post.description}</p>
            <div className="flex flex-wrap gap-2">
              {postFilters &&
                Object.values(postFilters).map((id: number, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gradient-to-br from-blue-100 via-gray-200 to-blue-400 p-1 hover:bg-gradient-to-br hover:from-gray-700 hover:via-blue-500 hover:to-gray-200"
                  >
                    {filters[id]}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" onClick={handleLikeClick}>
            <Heart
              className={`w-4 h-4 mr-2 ${liked ? 'fill-current text-red-500' : 'text-white'}`}
              fill={liked ? 'currentColor' : 'none'}
            />
            {likesCount}
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
        <Button variant="outline" size="sm">
          Comment Book
        </Button>
      </CardFooter>
    </Card>
  );
}

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { toast } from "nextjs-toast-notify";
import { likePost, unlikePost } from "@/app/actions";
import { PostStorage } from "@/app/types/PostStorage";
import { Book } from "@/app/types/Book";
import { getColorFromInitials, formatRelativeTime } from "@/app/lib/hashHelpers";
import CommentsPreview from "@/app/home/components/CommentPreview";
import { CommentScroll } from "@/app/home/components/CommentScroll";
import { Dialog } from "@/components/ui/dialog";
import {useFeed} from "@/contex/FeedContext";

type PostCardProps = {
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
}: PostCardProps) {
  const { user, post, book } = postStorage;
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(postStorage.like_set);
  const [likesCount, setLikesCount] = useState(post.likes);
  const {posts: postContext} = useFeed();

  const handleLikeClick = async () => {
    console.log("LIKE CLICKED", liked);
    console.log("LIKE IN CONTEXT", postContext[post.id].like_set);
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
      // Optimistic UI update
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      postContext[post.id].like_set = !liked;
      postContext[post.id].post.likes = liked ? likesCount - 1 : likesCount + 1;
    } catch (error: any) {
      console.error("Failed to update like status", error);
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

          <div className="flex flex-row space-x-10">
            <div className="flex flex-col">
              <span className="font-semibold">{user.username}</span>
              <span className="text-xs text-gray-500">
                {formatRelativeTime(post.created_at)}
              </span>
            </div>

            {currentUserId !== user.id && (
              <Button
                variant={user.following ? "default" : "outline"}
                className={`h-8 ${user.following ? "bg-blue-500/10" : "bg-blue-500"} text-white font-semibold py-2 px-4 rounded-l-md group`}
                onClick={() => handleFollowClick(user.id, user.following)}
              >
                {user.following ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className="grid md:grid-cols-[150px_1fr] lg:grid-cols-[200px_2fr_minmax(100px,300px)] xl:grid-cols-[200px_2fr_minmax(100px,400px)]
          gap-4 items-start justify-items-center md:justify-items-start transition-all duration-500"
        >
          <Image
            alt="Book cover Big Screen"
            className="rounded-lg object-cover shadow-md mb-2 hidden md:block"
            width={400}
            height={400}
            src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${book.id}.png`}
          />
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-bold text-blue-200">{book?.title}</h2>
              <p className="text-blue-400">by {book?.author}</p>
            </div>
            <Image
              alt="Book cover Small Screen"
              className="rounded-lg object-cover shadow-md mb-2 md:hidden"
              width={400}
              height={400}
              src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${book.id}.png`}
            />
            <p className="text-sm text-gray-300">{post.description}</p>
            <div className="flex flex-wrap gap-2">
              {postStorage.filters && Object.values(postStorage.filters).map((id: number, index) => (
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
          {/* Comments Preview */}
          <div className="max-w-[400px] lg:w-[300px] xl:w-[400px]">
            <CommentsPreview
              comments={postStorage.comments}
              n_comments={postStorage.n_comments}
              postStorage={postStorage}
            />
          </div>
        </div>

        {/* Mobile Comments Button */}
        <div className="block md:hidden">
          <button
            onClick={() => setShowComments(true)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-200 transition-colors"
          >
            <MessageCircle size={24} />
            <span>Comments ({postStorage.comments.length})</span>
          </button>
        </div>

        <Dialog open={true}>
          <div
            className={`pt-4 rounded-t-2xl w-full max-w-lg transition-all duration-500 transform ${
              showComments ? 'translate-y-0' : 'hidden translate-y-full pointer-events-none'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowComments(false)}
                className="text-blue-400 hover:text-blue-200"
              >
                Close
              </button>
            </div>
            <CommentScroll postsStorage={postStorage} slice={false} smallWindow={true} />
          </div>
        </Dialog>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex gap-4">
          <Button variant="ghost" size="sm"  onClick={handleLikeClick}>
              <Heart
                className={`w-10 h-10 mr-2 ${liked ? 'fill-current text-red-500' : 'text-white'}`}
                fill={liked ? 'currentColor' : 'none'}
              />
            {likesCount}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

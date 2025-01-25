import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Share2, X } from "lucide-react";
import { toast } from "nextjs-toast-notify";
import { likePost, unlikePost } from "@/app/actions";
import { PostStorage } from "@/app/types/PostStorage";
import { Book } from "@/app/types/Book";
import { getColorFromInitials, formatRelativeTime } from "@/app/lib/hashHelpers";
import CommentsPreview from "@/app/home/components/CommentPreview";
import { CommentScroll } from "@/app/home/components/CommentScroll";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {useFeed} from "@/contex/FeedContext";
import Link from "next/link";

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
      const result = await unlikePost(currentUserId, post.id);
      if (result.status !== 200) {
        throw new Error(result.message);
      }
      } else {
      const result = await likePost(currentUserId, post.id);
      if (result.status !== 200) {
        throw new Error(result.message);
      }
      }
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      postContext[post.id].like_set = !liked;
      postContext[post.id].post.likes = liked ? likesCount - 1 : likesCount + 1;
    } catch (error: any) {
      console.error("Failed to update like status", error);
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
      className="max-w-7xl bg-[#0a0a0a] border border-[#ff6b0033] shadow-[0_0_30px_rgba(255,107,0,0.1)] holographic-effect relative mb-4 overflow-hidden"
    >
      <div className="cyber-border absolute inset-0 pointer-events-none" />
      
      <CardHeader className="flex-row items-center border-b border-[#ff6b0033] pb-4 space-x-4">
        <Link href={`/profile?userId=${user?.id}`} className="group relative">
          <div className="absolute inset-0 bg-[#ff6b00] opacity-0 group-hover:opacity-10 transition-opacity rounded-full blur-md"/>
          <Avatar className="w-10 h-10 border-2 border-[#ff6b00] hover:scale-105 transition-transform">
            <AvatarImage src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}/${user.id}.png`} />
            <AvatarFallback
              style={{ backgroundColor: getColorFromInitials(user.username.substring(0, 2).toUpperCase()) }}
              className="text-white font-semibold text-sm"
            >
              {user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <Link 
                href={`/profile?userId=${user?.id}`} 
                className="text-[#ff6b00] font-semibold hover:text-[#ff3300] transition-colors"
              >
                {user.username}
              </Link>
              <span className="text-[#ff9e66] text-xs ml-4">
                {formatRelativeTime(post.created_at)}
              </span>
            </div>

            {currentUserId !== user.id && (
              <Button
                onClick={() => handleFollowClick(user.id, user.following)}
                className={`h-8 ${
                  user.following 
                    ? 'bg-transparent border border-[#ff6b0033] text-[#ff9e66] hover:bg-[#ff6b0011]' 
                    : 'bg-[#ff6b00] hover:bg-[#ff3300] text-white'
                } transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)]`}
              >
                {user.following ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid md:grid-cols-[150px_1fr] gap-6 items-start">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#ff6b00] opacity-0 group-hover:opacity-10 transition-opacity rounded-xl blur-lg"/>
            <Image
              alt="Book cover"
              className="rounded-lg object-cover shadow-lg w-full h-auto border border-[#ff6b0033]"
              width={400}
              height={400}
              src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${book.id}.png`}
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-[#ff6b00] neon-text">{book.title}</h2>
              <p className="text-[#ff9e66] mt-1">by {book.author}</p>
            </div>
            
            <p className="text-[#ff9e66] text-sm leading-relaxed">
              {post.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {postStorage.filters && Object.values(postStorage.filters).map((id: number) => (
                <Badge
                  key={id}
                  className="bg-[#1a1a1a] border border-[#ff6b0033] text-[#ff9e66] hover:bg-[#ff6b0011] transition-colors"
                >
                  {filters[id]}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <CommentsPreview
          comments={postStorage.comments}
          n_comments={postStorage.n_comments}
          postStorage={postStorage}
        />
      </CardContent>

      <CardFooter className="border-t border-[#ff6b0033] pt-4">
        <div className="flex gap-4 w-full">
          <Button 
            variant="ghost" 
            onClick={handleLikeClick}
            className="flex items-center gap-2 text-[#ff9e66] hover:bg-[#ff6b0011] group"
          >
            <Heart
              className={`w-6 h-6 ${
                liked ? 'text-[#ff3300] fill-current' : 'text-[#ff6b00]'
              } group-hover:scale-125 transition-transform`}
            />
            <span className="text-[#ff9e66]">{likesCount}</span>
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => setShowComments(true)}
            className="flex items-center gap-2 text-[#ff9e66] hover:bg-[#ff6b0011] group"
          >
            <MessageCircle className="w-6 h-6 text-[#ff6b00] group-hover:scale-125 transition-transform" />
            <span className="text-[#ff9e66]">{postStorage.comments.length}</span>
          </Button>
        </div>
      </CardFooter>

      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="bg-[#0a0a0a] border-[#ff6b0033] max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden holographic-effect">
          <div className="p-4 border-b border-[#ff6b0033] flex justify-between items-center">
            <h3 className="text-[#ff6b00] text-xl font-bold">Comments</h3>
            <X 
              className="text-[#ff9e66] cursor-pointer hover:text-[#ff3300] transition-colors"
              onClick={() => setShowComments(false)}
            />
          </div>
          
          <div className="overflow-y-auto flex-1 p-4">
            <CommentScroll 
              postsStorage={postStorage} 
              slice={false} 
              smallWindow={true} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
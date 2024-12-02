import React, {useState} from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {getColorFromInitials} from "@/app/lib/hashHelpers";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {MessageCircle, MoreHorizontal } from 'lucide-react';
import {CommentUnic, PostStorage} from "@/app/types/PostStorage";
import {formatRelativeTime} from "@/app/lib/hashHelpers";
import PostsPreviewHome from "@/app/home/components/PostsPreviewHome";

const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;

type CommentProps = {
    n_comments: number;
    comments: CommentUnic[];
    postStorage: PostStorage;
}

const CommentsPreview = ({ n_comments, comments, postStorage }: CommentProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => {
        setIsDialogOpen(true);
    };

  return (
    <div className="hidden lg:block bg-gray-900/25 rounded-lg border border-blue-900/30 shadow-lg">
      <div className="flex justify-between items-center pt-2 px-4 pb-2 border-b border-blue-900/30">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-200">
            Comentarios
          </h3>
        </div>
        <span className="text-sm text-blue-400 bg-blue-900/50 px-2 py-1 rounded-full ml-4">
          {n_comments} comment{n_comments !== 1 ? 's' : ''}
        </span>
      </div>

{comments.length > 0 && (
    <ScrollArea className="h-52 rounded-md border bg-gray-800/10">
        <div className="p-4 space-y-2">
          {comments.slice(0, 3).map((comment, index) => (
            <div
              key={index}
              className="group relative bg-gray-800/40 hover:bg-gray-800/90 transition-all duration-300 rounded-xl p-3
              border border-transparent hover:border-blue-800/50"
            >
              <div className="flex items-start space-x-3">
                <Avatar className="w-7 h-7 border-2 border-blue-400/50">
                    <AvatarImage
                        src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}/${comment.user.id}.png`}/>
                  <AvatarFallback
                    style={{
                      backgroundColor: getColorFromInitials(
                        comment.user.username.substring(0, 2).toUpperCase()
                      ),
                    }}
                    className="text-white font-semibold text-xs flex items-center justify-center"
                  >
                    {comment.user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-blue-300">
                      @{comment.user.username}
                    </span>
                    <span className="text-xs text-gray-400 ">
                      {formatRelativeTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {comment.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar
            orientation="vertical"
            className="bg-gray-700 rounded-full hover:bg-blue-500 transition-colors duration-300"
          />

      </ScrollArea>
    )}
        <div className="p-4 pt-2">
          <div className="border-2 border-blue-900/20"></div>
          <button className="w-full text-sm text-blue-400 hover:text-blue-200 bg-gray-800
          hover:bg-gray-800/40 py-2 rounded-lg transition-all flex items-center justify-center space-x-2"
          onClick={openDialog}
          >
              {n_comments > 0 ? (
                <span>View all {n_comments} comments</span>
                  ) : (
                    <span>Be the first to comment</span>
                  )}
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/*<PostsPreviewHome open={isDialogOpen} setIsDialogOpen={setIsDialogOpen} postsStorage={postStorage} />*/}
    </div>
  );
};

export default CommentsPreview;
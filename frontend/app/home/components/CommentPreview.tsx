import React, {useEffect, useState} from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {getColorFromInitials} from "@/app/lib/hashHelpers";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {MessageCircle, MoreHorizontal } from 'lucide-react';
import {CommentUnic, PostStorage} from "@/app/types/PostStorage";
import {formatRelativeTime} from "@/app/lib/hashHelpers";
import PostsPreviewHome from "@/app/home/components/PostsPreviewHome";
import {CommentScroll} from "@/app/home/components/CommentScroll";

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

    useEffect(() => {
        console.log("CommentsPreview fromPOSTSTORAGE", comments);
    }, []);

  return (
    <div className="hidden lg:block bg-gray-900/25 rounded-lg border border-blue-900/30 shadow-lg">
      <div className="flex justify-between items-center pt-2 px-4 pb-2 border-b border-blue-900/30">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-200">
            Comments
          </h3>
        </div>
        <span className="text-sm text-blue-400 bg-blue-900/50 px-2 py-1 rounded-full ml-4">
          {n_comments} comment{n_comments !== 1 ? 's' : ''}
        </span>
      </div>

        {/** If there are comments, show them */}
        {comments.length > 0 && ( <CommentScroll postsStorage={postStorage} slice={true} smallWindow={false} /> )}

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

        <PostsPreviewHome open={isDialogOpen} setIsDialogOpen={setIsDialogOpen} postsStorage={postStorage} />
    </div>
  );
};

export default CommentsPreview;
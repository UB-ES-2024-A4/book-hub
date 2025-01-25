import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {formatRelativeTime, getColorFromInitials, handleSubmitCommentInPost} from "@/app/lib/hashHelpers";
import React, {useEffect, useState, memo} from "react";
import {CommentUnic, PostStorage, UserUnic} from "@/app/types/PostStorage";
// import {fetchCommentsByPostID} from "@/app/actions";
import {getSession} from "@/app/lib/authentication";
import {useFeed} from "@/contex/FeedContext";
import {CommentTextArea} from "@/app/home/components/CommentTextArea";
import Link from "next/link";
const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;

type CommentProps = {
    postsStorage: PostStorage;
    slice: boolean;
    smallWindow: boolean;
}



const CommentScroll = memo( ({ postsStorage, slice, smallWindow }: CommentProps)  => {

    const { posts } = useFeed();
    const [ newComment, setNewComment ] = useState('');
    const { addCommentByUser } = useFeed();
    const [ user, setUser ] = useState<UserUnic| null>(null);
    const [ comments, setComments ] = useState<CommentUnic[]>([]);

    useEffect(() => {
        const load = async () => {
            const user = await getSession();
            setUser({
                following: false,
                username: user?.username || '',
                id: user?.id || -1
            });
            setNewComment('');

            // Ordena y actualiza los comentarios
            const sortedComments = [...postsStorage.comments].sort((a:CommentUnic, b:CommentUnic) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            setComments(sortedComments);
        }

        load();

    }, [posts]);

    function handleSubmit() {
        handleSubmitCommentInPost(newComment, setComments, comments, setNewComment, postsStorage, addCommentByUser, user);
    }

    return (
      <div className="space-y-4">
        <ScrollArea className={`rounded-lg border border-[#ff6b0033] bg-[#0a0a0a]/80 ${smallWindow ? 'h-96' : 'h-52'}`}>
          <div className="p-4 space-y-3">
            {(slice ? comments.slice(0, 4) : comments).map((comment: CommentUnic, index: number) => (
              <div
                key={index}
                className="group relative bg-[#1a1a1a] hover:bg-[#ff6b0011] rounded-xl p-3
                  border border-[#ff6b0033] transition-all duration-300
                  hover:border-[#ff6b00] hover:shadow-[0_0_15px_rgba(255,107,0,0.1)]"
              >
                <div className="flex items-start space-x-3">
                  <Link href={comment.user.id === user?.id ? "/account" : `/profile?userId=${comment.user.id}`}
                        className="hover:opacity-80 transition-opacity">
                    <Avatar className="w-8 h-8 border-2 border-[#ff6b00] group-hover:scale-105 transition-transform">
                      <AvatarImage
                        src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}/${comment.user.id}.png?timestamp=${new Date().getTime()}`}
                      />
                      <AvatarFallback
                        style={{
                          backgroundColor: getColorFromInitials(
                            comment.user.username.substring(0, 2).toUpperCase()
                          ),
                        }}
                        className="text-white font-semibold text-sm"
                      >
                        {comment.user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-[#ff6b00]">
                        {comment.user.username}
                      </span>
                      <span className="text-xs text-[#ff9e66]">
                        {formatRelativeTime(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-[#ff9e66]">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar
            orientation="vertical"
            className="bg-[#ff6b0033] rounded-full hover:bg-[#ff6b00] transition-colors"
          />
        </ScrollArea>
  
        {smallWindow && (
          <div className="pt-4 border-t border-[#ff6b0033]">
            <CommentTextArea 
              newComment={newComment} 
              setNewComment={setNewComment} 
              handleSubmitComment={handleSubmit} 
              className="bg-[#0a0a0a] border-[#ff6b0033] text-[#ff9e66]
                placeholder-[#ff6b0066] focus:border-[#ff6b00]
                hover:shadow-[0_0_15px_rgba(255,107,0,0.1)]"
              buttonStyle="bg-gradient-to-r from-[#ff6b00] to-[#ff3300] hover:from-[#ff3300] hover:to-[#ff6b00]
                text-white shadow-[0_0_15px_rgba(255,107,0,0.3)]"
            />
          </div>
        )}
      </div>
    );
});

CommentScroll.displayName = 'CommentScroll';

export { CommentScroll };
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {formatRelativeTime, getColorFromInitials, handleSubmitCommentInPost} from "@/app/lib/hashHelpers";
import React, {useEffect, useState} from "react";
import {CommentUnic, PostStorage, UserUnic} from "@/app/types/PostStorage";
import {fetchCommentsByPostID} from "@/app/actions";
import {getSession} from "@/app/lib/authentication";
import {useFeed} from "@/contex/FeedContext";
import {CommentTextArea} from "@/app/home/components/CommentTextArea";
const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;

type CommentProps = {
    postsStorage: PostStorage;
    slice: boolean;
    smallWindow: boolean;
}



export const CommentScroll = ({ postsStorage, slice, smallWindow }: CommentProps) => {

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
            console.log("CommentsSCROLL POSTORAGE: ------------", postsStorage.comments);

            // Ordena y actualiza los comentarios
            const sortedComments = [...postsStorage.comments].sort((a, b) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            setComments(sortedComments);
            console.log("CommentsSCROLL: ------------", comments);
        }

        load();

    }, [posts]);

    function handleSubmit() {
        handleSubmitCommentInPost(newComment, setComments, comments, setNewComment, postsStorage, addCommentByUser, user);
    }

    return (
        <div>
         <ScrollArea className={`rounded-md border bg-gray-800/10 ${smallWindow ? 'h-96' : 'h-52'}`}>
        <div className="p-4 space-y-2">
          {(slice ? comments.slice(0, 4) : comments).map((comment: CommentUnic, index: number) => (
            <div
              key={index}
              className="group relative bg-gray-800/40 hover:bg-gray-800/90 transition-all duration-300 rounded-xl p-3
              border border-transparent hover:border-blue-800/50"
            >
              <div className="flex items-start space-x-3">
                <Avatar className="w-7 h-7 border-2 border-blue-400/50">
                    <AvatarImage
                        src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}/${comment.user.id}.png?timestamp=${new Date().getTime()}`}/>
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
                      {comment.user.username}
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
            {smallWindow && (
                <div className="pt-4">
                <CommentTextArea newComment={newComment} setNewComment={setNewComment} handleSubmitComment={handleSubmit} />
                    </div>
            )}
            </div>
    );
}
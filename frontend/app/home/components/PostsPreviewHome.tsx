import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import {ScrollArea } from '@/components/ui/scroll-area';
import {useFeed} from "@/contex/FeedContext";
import {CommentUnic, PostStorage, UserUnic} from "@/app/types/PostStorage";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {formatRelativeTime, getColorFromInitials, handleSubmitCommentInPost} from "@/app/lib/hashHelpers";
import Image from "next/image";
import {getSession} from "@/app/lib/authentication";
import {CommentTextArea} from "@/app/home/components/CommentTextArea";
import {handleFollowClick} from "@/app/lib/hashHelpers";

type PostsPreviewProps = {
    open: boolean;
    setIsDialogOpen: (open: boolean) => void;
    postsStorage: PostStorage;
}

const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;
const NEXT_PUBLIC_STORAGE_BOOKS = process.env.NEXT_PUBLIC_STORAGE_BOOKS;

const PostsPreview = ({open, setIsDialogOpen, postsStorage}: PostsPreviewProps) => {
    const { addCommentByUser } = useFeed();
    const [ comments, setComments ] = useState<CommentUnic[]>([]);
    const [ newComment, setNewComment ] = useState('');
    const [ user, setUser] = useState<UserUnic| null>(null);
    const { posts: postsContext } = useFeed();

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getSession();
            setComments(postsStorage.comments);
            setUser({
                following: false,
                username: user?.username || '',
                id: user?.id || -1
            });
        };
        fetchUser();
    }, []);

    const handleSubmitComment = async () => {
        await handleSubmitCommentInPost(newComment, setComments, comments,
                                setNewComment, postsStorage, addCommentByUser, user);
    }

    return (
    <Dialog open={open} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] p-0 border-0 rounded-lg overflow-y-auto max-h-[90vh]">
            <Card className="w-full flex flex-col md:flex-row border-2 border-[#051B32] bg-[#051B32] rounded-lg">
                {/* Post Section */}
                <div className="w-full md:w-1/2 bg-gray-900/70 text-white flex flex-col px-6 md:px-10 lg:px-16 py-4">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="w-10 h-10 border-2 border-blue-400">
                            <AvatarImage
                                src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}/${postsStorage.post.id}.png`}/>
                            <AvatarFallback
                                style={{
                                    backgroundColor: postsStorage.user.username
                                        ? getColorFromInitials(postsStorage.user.username.substring(0, 2).toUpperCase())
                                        : 'hsl(215, 100%, 50%)',
                                }}
                                className="text-white font-semibold text-sm flex items-center justify-center"
                            >
                                {postsStorage.user.username
                                    ? postsStorage.user.username.substring(0, 2).toUpperCase()
                                    : '?'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-row space-x-6">
                            <div className="flex flex-col">
                                <span className="font-semibold">{postsStorage.user.username}</span>
                                <span className="text-xs text-gray-500">
                                    {postsStorage.book.title}
                                </span>
                            </div>
                            <div>
                                {postsStorage.user.following ? (
                                    <button className="px-2 py-1 text-white bg-gray-500 rounded" disabled>
                                        Following
                                    </button>
                                ) : (
                                    <button
                                        className="px-2 py-1  text-white bg-blue-500 rounded hover:bg-blue-600"
                                        onClick={() => {
                                            const [following, setFollowing] = useState(postsStorage.user.following);
                                            handleFollowClick(postsStorage.user.id,
                                                following,
                                                user?.id || -1, setFollowing, postsContext);
                                        }}
                                    >
                                        Follow
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-center">
                        {/* Book Image */}
                        <Image
                            src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${postsStorage.book.id}.png`}
                            alt={postsStorage.book.title}
                            width={600}
                            height={600}
                            className="w-[60%] h-auto object-cover rounded-lg mb-4 mx-auto"
                        />
                    </div>

                    <div className="text-sm text-white/70 mb-2">
                        <span className="font-semibold">Book Description: </span>
                        {postsStorage.book.description}
                    </div>
                    {/* Separator */}
                    <div className="border-b border-white/20 my-2"/>
                    {/* Caption */}
                    <div>
                        <div className="text-sm mb-2">
                            <span className="font-semibold">@{postsStorage.user.username} </span>
                            <span className="text-white/70">{postsStorage.post.description}</span>
                        </div>
                        <p className="text-xs text-gray-500">Book by {postsStorage.book.author}</p>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-between p-4 bg-[#1e4e83]/40 md:pt-8 lg:pt-8">
                    {/* Comments Scroll Area */}
                    <ScrollArea className="h-[500px] rounded-md border bg-gray-800/10 mb-4">
                    <div className="p-4 space-y-2 ">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="bg-gray-800/40 hover:bg-gray-800/90 transition-all duration-300 rounded-xl p-3"
                                >
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="w-7 h-7 border-2 border-blue-400/50">
                                            <AvatarImage
                                                src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}/${comment.user.id}.png?timestamp=${new Date().getTime()}`}
                                            />
                                            <AvatarFallback
                                                className="text-white font-semibold text-xs flex items-center justify-center"
                                                style={{
                                                    backgroundColor: getColorFromInitials(
                                                        comment.user.username.substring(0, 2).toUpperCase()
                                                    ),
                                                }}
                                            >
                                                {comment.user.username.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-semibold text-blue-300">
                                                    {comment.user?.username}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {formatRelativeTime(comment.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-300">
                                                {comment.comment}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* Comment Input */}
                    <CommentTextArea newComment={newComment} setNewComment={setNewComment} handleSubmitComment={handleSubmitComment} />

                </div>
            </Card>
        </DialogContent>
    </Dialog>
)
};

export default PostsPreview;
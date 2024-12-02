import React, {useEffect, useState} from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {BookImage, Bookmark, Heart, MessageCircle, Share2} from 'lucide-react';
import {toast} from "nextjs-toast-notify";
import {fetchCommentsByPostID} from "@/app/actions";
import {useFeed} from "@/contex/FeedContext";
import {CommentUnic, PostStorage} from "@/app/types/PostStorage";
import CommentsPreview from "@/app/home/components/CommentPreview";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {formatRelativeTime, getColorFromInitials} from "@/app/lib/hashHelpers";
import Image from "next/image";

type PostsPreviewProps = {
    open: boolean;
    setIsDialogOpen: (open: boolean) => void;
    postsStorage: PostStorage;
}

const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;
const NEXT_PUBLIC_STORAGE_BOOKS = process.env.NEXT_PUBLIC_STORAGE_BOOKS;

const PostsPreview = ({open, setIsDialogOpen, postsStorage}: PostsPreviewProps) => {
    const { comments: commentsContext, addComments, addCommentByUser } = useFeed();
    const [ comments, setComments ] = useState<CommentUnic[]>([]);
    const [ newComment, setNewComment ] = useState('');

    useEffect(() => {
        async function fetchComments() {
            const postID = postsStorage.post.id;
            if (commentsContext[postID]) {
                setComments(commentsContext[postID]);
                return;
            }
            const response = await fetchCommentsByPostID(postID);
            if (response.status !== 200) {
                console.error(response.message);
                return;
            } else {
                const commentsUnics = response.data;
                if (commentsUnics) {
                    setComments(commentsUnics);
                    addComments(commentsUnics, postID);
                }
            }
        }
        fetchComments()
    }, []);

    const handleSubmitComment = () => {
        if (newComment.trim() === '') {
            toast.error("You should enter a comment to submit", {
                duration: 4000,
                progress: true,
                position: "bottom-left",
                transition: "swingInverted",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n' +
                    '  <circle cx="12" cy="12" r="10"/>\n' +
                    '  <line x1="12" y1="8" x2="12" y2="12"/>\n' +
                    '  <line x1="12" y1="16" x2="12.01" y2="16"/>\n' +
                '</svg>',
                sonido: true,
            });
            return;
        }
        const commentToAdd : CommentUnic = {
            created_at: new Date(),
            comment: newComment,
            user: postsStorage.user
        }
        setComments([commentToAdd, ...comments]);
        setNewComment('');
        addCommentByUser(commentToAdd, postsStorage.post.id);
    };

    return (
    <Dialog open={open} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] p-0 border-0 rounded-lg overflow-y-auto max-h-[90vh]">
            <Card className="w-full flex flex-col md:flex-row border-2 border-[#051B32] bg-[#051B32] rounded-lg">
                {/* Post Section */}
                <div className="w-full md:w-1/2 bg-gray-900/70 text-white flex flex-col px-6 md:px-10 lg:px-16 py-4">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="w-10 h-10 border-2 border-white/20">
                            <AvatarImage
                                src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}/${postsStorage.user.id}.png`}
                                alt={postsStorage.user.username}
                            />
                            <AvatarFallback className="bg-blue-600 text-white font-bold">
                                {postsStorage.user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="font-semibold text-sm">@{postsStorage.user.username}</p>
                            <p className="text-xs text-gray-400">{postsStorage.book.title}</p>
                        </div>
                    </div>

                    {/* Book Image */}
                    <Image
                        src={`${NEXT_PUBLIC_STORAGE_BOOKS}/${postsStorage.book.id}.png`}
                        alt={postsStorage.book.title}
                        width={600}
                        height={600}
                        className="w-2/3 md:w-2/3 lg:w-1/2 h-[400px] object-cover rounded-lg mb-4"
                    />
                    <div className="text-sm text-white/70 mb-2">
                        <span className="font-semibold">Book Description: </span>
                        {postsStorage.book.description}
                    </div>
                    {/* Separator */}
                    <div className="border-b border-white/20 my-2" />
                    {/* Caption */}
                    <div>
                        <p className="text-sm font-semibold mb-2">@{postsStorage.user.username}</p>
                        <p className="text-sm text-white/70 mb-2">{postsStorage.post.description}</p>
                        <p className="text-xs text-gray-500">Book by {postsStorage.book.author}</p>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-between p-4 bg-[#051B32] md:pt-8 lg:pt-8">
                    {/* Comments Scroll Area */}
                    <ScrollArea className="h-[500px] rounded-md border bg-gray-800/10 mb-4">
                        <div className="p-4 space-y-2 ">
                            {comments.map((comment, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-800/40 hover:bg-gray-800/90 transition-all duration-300 rounded-xl p-3"
                                >
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="w-7 h-7 border-2 border-blue-400/50">
                                            <AvatarImage
                                                src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}/${comment.user.id}.png`}
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
                                                    @{comment.user.username}
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
                    <div className="flex space-x-2">
                        <Textarea
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-grow text-white"
                            maxLength={500}
                        />
                        <Button
                            onClick={handleSubmitComment}
                            disabled={newComment.trim() === ''}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </Card>
        </DialogContent>
    </Dialog>
)
};

export default PostsPreview;
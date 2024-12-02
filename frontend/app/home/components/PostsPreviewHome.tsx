import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookImage } from 'lucide-react';
import {toast} from "nextjs-toast-notify";
import {fetchCommentsByPostID} from "@/app/actions";
import {useFeed} from "@/contex/FeedContext";
import {CommentUnic, PostStorage} from "@/app/types/PostStorage";
import CommentsPreview from "@/app/home/components/CommentPreview";
import {Dialog} from "@/components/ui/dialog";

type PostsPreviewProps = {
    open: boolean;
    setIsDialogOpen: (open: boolean) => void;
    postsStorage: PostStorage;
}

const PostsPreview = ({open, setIsDialogOpen, postsStorage}: PostsPreviewProps) => {
    const { comments: commentsContext, addComments, addCommentByUser } = useFeed();
    const [ comments, setComments ] = useState<CommentUnic[]>([]);
    const [ newComment, setNewComment ] = useState('');

    useEffect(() => {
        async function fetchComments() {
            const postID = postsStorage.post.id;
            /*First, we look if there is already information of the comments in the specific Posts in the Context*/
            if (commentsContext[postID]) {
                setComments(commentsContext[postID]);
                return;
            }
            /*If there is no information in the context, we fetch the comments from the API
            * and store them in the map with the specific Post ID*/
            const response = await fetchCommentsByPostID(postID);
            if (response.status !== 200) {
                console.error(response.message);
                return;
            }else{
                const commentsUnics = response.data;
                if (commentsUnics) {
                    setComments(commentsUnics);
                    // Add the comments to the context
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
    // Here we would send the comment to the API
    // and then add it to the comments array
    const commentToAdd : CommentUnic = {
        created_at: new Date(),
        comment: newComment,
        user: postsStorage.user
    }
    setComments([commentToAdd, ...comments]);
    setNewComment('');
    // Add the comment to the context in the specific post
    addCommentByUser(commentToAdd, postsStorage.post.id);
  };

    const onOpenChange = () => {
        setIsDialogOpen(!open);
    }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <Card className="w-full max-w-4xl mx-auto flex flex-col md:flex-row">
      {/* Book Image Section */}
      <div className="w-full md:w-1/3 p-4 flex justify-center items-center">
        <BookImage size={200} className="text-gray-400" />
      </div>

      {/* Book Details and Comments Section */}
      <div className="w-full md:w-2/3 p-4 flex flex-col">
        {/* Book Details */}
        <CardHeader>
          <CardTitle>{postsStorage.book.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{postsStorage.book.author}</p>
          <p className="mt-2">{postsStorage.book.description}</p>
        </CardHeader>

        {/* Comments Section */}
        <CardContent className="flex-grow flex flex-col">
          <div className="flex space-x-2 mb-4">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow"
            />
            <Button
              onClick={handleSubmitComment}
              disabled={newComment.trim() === ''}
            >
              Submit
            </Button>
          </div>

          {/* CommentsPreview for Consistent Scroll Area */}
          <CommentsPreview
            n_comments={comments.length}
            comments={comments}
            postStorage={postsStorage}
          />

        </CardContent>
      </div>
    </Card>
    </Dialog>
  );
};

export default PostsPreview;
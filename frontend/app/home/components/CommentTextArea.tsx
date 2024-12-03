import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import React from "react";


type CommentTextAreaProps = {
    newComment: string;
    setNewComment: (value: string) => void;
    handleSubmitComment: () => void;
}

export const CommentTextArea = ({newComment, setNewComment, handleSubmitComment}: CommentTextAreaProps) => {
    return (
        <div className="flex flex-col">
            {/* Comment Input */}
            <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow text-white w-full"
                maxLength={500}
            />
            {/* Submit Button */}
            <Button
                className="w-full mt-2"
                onClick={handleSubmitComment}
                disabled={newComment.trim() === ''}
            >
                Submit
            </Button>
        </div>
    )
}
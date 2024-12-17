import React from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import Image from "next/image";
import {Heart, MessageCircle} from "lucide-react";
import {Post} from "@/app/types/Post";
import {useFeed} from "@/contex/FeedContext";

type PostDialogAccountProps = {
  selectedPost: Post | null;
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | null>>;
};

const PostDialog: React.FC<PostDialogAccountProps> = ({ selectedPost, setSelectedPost }) => {
  // Component implementation
    const {userLogin} = useFeed();
  return (
    <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{userLogin?.username}</DialogTitle>
                    <DialogDescription>{userLogin?.first_name}</DialogDescription>
                </DialogHeader>
                <Image
                    src={'/book.jpg'}
                    alt={"title"} width={500} height={500}
                    className="w-full h-64 object-cover mb-4"
                />
                <p>{"Description of this Post"}</p>
                <div className="flex flex-wrap gap-2 my-4">
                    {["Filtro 1", "Filtro 2", "Filtro 3"].map((tag, index) => (
                        <span key={index} className="bg-gray-200 text-xs px-2 py-1 rounded">{tag}</span>
                    ))}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <button className="flex items-center">
                        <Heart className="w-4 h-4 mr-1 text-red-600 fill-current"/> {selectedPost?.likes} Likes
                    </button>
                    <button className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1"/> X&#39;s comments
                    </button>
                </div>
            </DialogContent>
        </Dialog>
  );
};
export default PostDialog;
import {followUser, postComment, unfollowUser} from "@/app/actions";
import {CommentUnic, PostStorage, UserUnic} from "@/app/types/PostStorage";
import {toast} from "nextjs-toast-notify";

export function getColorFromInitials(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}



// Utility function to format relative time
export const formatRelativeTime = (date: Date | string) => {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (diffInSeconds < minute) {
    return 'Hace un momento';
  } else if (diffInSeconds < hour) {
    const mins = Math.floor(diffInSeconds / minute);
    return `Hace ${mins} min`;
  } else if (diffInSeconds < day) {
    const hrs = Math.floor(diffInSeconds / hour);
    return `Hace ${hrs} h`;
  } else if (diffInSeconds < day * 7) {
    const days = Math.floor(diffInSeconds / day);
    return `Hace ${days} d`;
  } else {
    // Fallback to a simple date format if more than a week old
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  }
};

export const errorMessage=(message:string)=>{
    toast.error(message, {
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
}
const successMessage=(message:string)=>{
        toast.success(message, {
          duration: 3000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
          sonido: true,
        });
}

export const handleSubmitCommentInPost = async (newComment: string,
                                   setComments: React.Dispatch<React.SetStateAction<CommentUnic[]>>,
                                   comments: CommentUnic[], setNewComment: React.Dispatch<React.SetStateAction<string>>,
                                   postsStorage: PostStorage, addCommentByUser: (comment: CommentUnic, postID: number) => void,
                                   user: UserUnic | null
                                   ) => {
    if (newComment.trim() === '') {
        errorMessage("You should enter a comment to submit")
        return;
    }
    const response = await postComment(postsStorage.post.id, newComment);
    if(response.status !== 200) {
        errorMessage(response.message);
        return;
    }else {
        console.log("Comment added successfully", response.data);
        if(user) {
            const commentToAdd: CommentUnic = {
                id: response.data.id,
                created_at: new Date(),
                comment: newComment,
                user: user
            }

            setComments([commentToAdd, ...comments]);
            setNewComment('');
            addCommentByUser(commentToAdd, postsStorage.post.id);
        }
    }
};


  // Handle follow/unfollow button click
export const handleFollowClick = async (
    postUserId: number,
    isCurrentlyFollowing: boolean,
    currentUserId: number,
    updateFollowingState: (following: boolean) => void,
    postsContext: { [key: number]: PostStorage }
  ) => {
    try {
      if (isCurrentlyFollowing) {
        const result = await unfollowUser(currentUserId, postUserId);
        if (result.status !== 200) throw new Error(result.message);
      } else {
        const result = await followUser(currentUserId, postUserId);
        if (result.status !== 200) throw new Error(result.message);
      }
      // Update the local state to reflect the change
      updateFollowingState(!isCurrentlyFollowing);
      // Update the following status in the post of PostContext
      postsContext[postUserId].user.following = !isCurrentlyFollowing;
      successMessage("Everything went well");

    } catch (error: any) {
        console.error("Failed to update following status", error);
        // Show a toast notification
        errorMessage(error.message);
    }
  };
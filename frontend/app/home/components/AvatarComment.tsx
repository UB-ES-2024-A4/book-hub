import React, { useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getColorFromInitials } from "@/app/lib/hashHelpers";
import { CommentUnic } from "@/app/types/PostStorage";

type AvatarCommentProps = {
    userId: number;
    timestamp: number;
};

type AvatarFallbackProps = {
    username: string;
};

const NEXT_PUBLIC_STORAGE_PROFILE_PICTURES = process.env.NEXT_PUBLIC_STORAGE_PROFILE_PICTURES;


const AvatarImageComponent = React.memo(({ userId, timestamp }: AvatarCommentProps) => (
    <AvatarImage
      src={`${NEXT_PUBLIC_STORAGE_PROFILE_PICTURES}/${userId}.png?timestamp=${timestamp}`}
    />
  ));
AvatarImageComponent.displayName = "AvatarImageComponent";
  
  const AvatarFallbackComponent = React.memo(({ username }: AvatarFallbackProps) => {
    const backgroundColor = getColorFromInitials(
      username.substring(0, 2).toUpperCase()
    );
  
    return (
      <AvatarFallback
        style={{ backgroundColor }}
        className="text-white font-semibold text-xs flex items-center justify-center"
      >
        {username.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    );
  });
AvatarFallbackComponent.displayName = "AvatarFallbackComponent";
  
type AvatarWithFallbackProps = {
    comment: CommentUnic;
};

  const AvatarWithFallback = ({ comment }: AvatarWithFallbackProps) => {
    const timestamp = useMemo(() => new Date().getTime(), []);
  
    return (
      <Avatar className="w-7 h-7 border-2 border-blue-400/50">
        <AvatarImageComponent userId={comment.user.id} timestamp={timestamp} />
        <AvatarFallbackComponent username={comment.user.username} />
      </Avatar>
    );
  };
  

  export default AvatarWithFallback;
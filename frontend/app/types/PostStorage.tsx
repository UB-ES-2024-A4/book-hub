import {Book} from "@/app/types/Book";

interface UserBasic {
    username: string;
    id: number;
}

interface CommentUnic {
    created_at: Date
    comment: string
    user: UserBasic
}

interface UserUnic extends UserBasic {
    is_following: boolean; // `boolean | undefined` => `?`.
}

interface PostUnic {
  id: number
  likes: number;
  description: string;
  created_at: string;
}

export interface PostStorage{
    user: UserUnic
    post: PostUnic
    book: Book;
    filters: number[]
    likes_set: boolean
    n_comments: number
    comments:CommentUnic
}
import {Book} from "@/app/types/Book";
import {Post} from "@/app/types/Post";

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
    following: boolean; // `boolean | undefined` => `?`.
}

export interface PostStorage{
    user: UserUnic
    post: Post
    book: Book;
    filters: number[]
    like_set: boolean
    n_comments: number
    comments: CommentUnic[]
}
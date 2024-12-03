import {Book} from "@/app/types/Book";
import {Post} from "@/app/types/Post";

interface UserBasic {
    username: string;
    id: number;
}

export interface UserUnic extends UserBasic {
    following: boolean; // `boolean | undefined` => `?`.
}

export interface CommentUnic {
    id?: number
    created_at: Date
    comment: string
    user: UserUnic
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
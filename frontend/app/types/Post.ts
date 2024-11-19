import {Filter} from "./Filter";

export interface Post {
  id: number;
  book_id: number;
  user_id: number;
  title: string;
  author: string;
  coverImage: string;
  tags: string[];
  content: string;
  likes: number;
  comments: number;
  description: string;
  created_at: string;
  filter_ids: Filter[];
}
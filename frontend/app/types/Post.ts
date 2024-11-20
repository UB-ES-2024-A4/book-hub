import {Filter} from "./Filter";

export interface Post {
  id: number;
  book_id: number;
  user_id: number;
  likes: number;
  description: string;
  created_at: string;
  filter_ids: Filter[];
}
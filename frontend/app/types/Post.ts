export type Post = {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  content: string;
  tags: string[];
  likes: number;
  shares?: number;
  comments: number;
};

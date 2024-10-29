// types/User.ts
export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  profilePicture: string | null;
  coverPhoto: string | null;
};
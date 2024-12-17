// types/User.ts
export type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  biography: string;
  following?: boolean;
};
import {z} from 'zod';

export const signUpSchema = z.object({
    username: z.string().min(3).max(20),
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(28)
});

export const signInSchema = z.object({
    user: z.string().email().or(z.string().min(3).max(28)),
    password: z.string().min(8).max(28)
});
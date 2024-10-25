import {z} from 'zod';

export const signUpSchema = z.object({
    username: z.string().min(3).max(20),
    firstName: z.string().max(20),
    lastName: z.string().max(20),
    email: z.string().email(),
    password: z.string().min(8).max(28)
});

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(28)
});
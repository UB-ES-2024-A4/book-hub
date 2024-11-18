import { z } from 'zod';

export const signUpSchema = z.object({
    username: z.string().min(3).max(20),
    first_name: z.string().max(20),
    last_name: z.string().max(20),
    email: z.string().email(),
    password: z.string().min(8).max(28)
});

export const signInSchema = z.object({
    user: z.string().email().or(z.string().min(3).max(28)),
    password: z.string().max(28)
});

export const userInformationSchema = z.object({
    username: z.string().min(3).max(20),
    first_name: z.string().max(20),
    last_name: z.string().max(20),
    biography: z.string().max(200)
});

export const createPostSchema = z.object({
    title: z.string().max(50),
    author: z.string().max(50),
    post_description: z.string().min(3).max(200).optional(),
    description: z.string().min(3).max(200)
});
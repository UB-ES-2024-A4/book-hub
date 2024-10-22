import {z} from 'zod';

export const singUpSchema = z.object({
    username: z.string().min(3).max(20),
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(28)
});
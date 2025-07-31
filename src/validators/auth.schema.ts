import { z } from 'zod';

export const authValidation = {
  login: z.object({
    identifier: z.string().nonempty('Email or username is required'),
    password: z.string().nonempty('Password is required'),
  }),
  register: z.object({
    fullname: z.string().nonempty('Name is required').min(3, 'Fullname must be at least 3 characters'),
    email: z.email().nonempty('Email is required'),
    username: z.string().nonempty('Username is required').min(3, 'Username must be at least 3 characters'),
    password: z.string().nonempty('Password is required').min(6, 'Password must be at least 6 characters'),
    phoneNumber: z.string().nonempty('Phone number is required'),
    role: z.string().refine((val) => ['ADMIN', 'MENTOR', 'STUDENT'].includes(val), {
      message: 'Role is invalid. Please choose a valid role.',
    }),
  }),
};

export type RegisterUser = z.infer<typeof authValidation.register>;
export type LoginUser = z.infer<typeof authValidation.login>;

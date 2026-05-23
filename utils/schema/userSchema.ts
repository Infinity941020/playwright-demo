// utils/schema/userSchema.ts
import { z } from 'zod';

/*
================================
ReqRes User Schema
================================
*/

export const userSchema = z.object({
  data: z.object({
    id: z.number(),
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    avatar: z.string()
  })
});
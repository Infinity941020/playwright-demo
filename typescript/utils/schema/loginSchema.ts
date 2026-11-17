// utils/schema/loginSchema.ts

import { z } from 'zod';

/*
================================
Login Response Schema
================================
ReqRes Login Response
================================
*/

export const loginSchema = z.object({
  token: z.string(),
});
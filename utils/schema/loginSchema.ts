// utils/schema/loginSchema.ts

import { z } from 'zod';

/*
================================
Login Response Schema
================================
JSONPlaceholder /posts のレスポンス構造
================================
*/

export const loginSchema = z.object({
  id: z.number(),
});
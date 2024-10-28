import { z, ZodType } from "zod";

export class userValidation {
  static readonly register: ZodType = z.object({
    username: z.string().min(8).max(100),
    password: z.string().min(8).max(100),
    name: z.string().min(1).max(100),
  });

  static readonly login: ZodType = z.object({
    username: z.string().min(8).max(100),
    password: z.string().min(8).max(100),
  });

  static readonly update: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(8).max(100).optional()
  })
}
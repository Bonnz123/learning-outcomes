import { z, ZodType } from "zod";

export class addressValidation {
  static create: ZodType = z.object({
    street: z.string().min(4).max(100).optional(),
    city: z.string().min(4).max(100).optional(),
    province: z.string().min(4).max(100).optional(),
    country: z.string().min(4).max(100),
    postalCode: z.string().min(4).max(10),
    contactId: z.number().positive().min(1),
  });

  static get: ZodType = z.object({
    id: z.number().positive().min(1),
    contactId: z.number().positive().min(1),
  });

  static update: ZodType = z.object({
    id: z.number().positive().min(1),
    street: z.string().min(4).max(100).optional(),
    city: z.string().min(4).max(100).optional(),
    province: z.string().min(4).max(100).optional(),
    country: z.string().min(4).max(100).optional(),
    postalCode: z.string().min(4).max(10).optional(),
    contactId: z.number().positive().min(1),
  });

  static list: ZodType = z.number().positive().min(1)
}

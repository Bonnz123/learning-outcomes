import { z, ZodType } from "zod";

export class contactValidation {
  static readonly create: ZodType = z.object({
    firstName: z.string().min(4).max(100),
    lastName: z.string().min(4).max(100),
    email: z.string().email().optional(),
    phone: z.string().min(12).max(16),
  })

  static readonly get: ZodType = z.number().positive().min(1)

  static readonly update: ZodType = z.object({
    id: z.number().positive().min(1),
    firstName: z.string().min(4).max(100).optional(),
    lastName: z.string().min(4).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(12).max(16).optional(),
  })

  static readonly search: ZodType = z.object({
    name: z.string().min(1).optional(),
    email: z.string().min(1).email().optional(),
    phone: z.string().min(1).max(16).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive()
  })
}
import { ZodType } from "zod";

export class Validation {
  static async validate<T>(schema: ZodType, data: T): Promise<T>{
    return await schema.parse(data)
  }
}
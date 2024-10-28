import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

export const prismaClient = new PrismaClient();

export const redis = new Redis({
  host: 'localhost',
  port: 6379,
  db: 0,
})
import { Request } from "express";

export type tokenAndRefresh = {
  username: string;
  newAccessToken?: string
}

export interface UserRequest extends Request {
  user?: tokenAndRefresh
}
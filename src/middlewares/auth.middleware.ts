import { Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import { tokenAndRefresh, UserRequest } from "../utils/token.util";
dotenv.config();

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  let accessToken = req.get("Authorization");

  if (!accessToken) {
    res.status(404).json({ errors: "Unauthorized" });
  } else {
    try {
      req.user = jwt.verify(
        accessToken as string,
        process.env.SECRET_KEY as string
      ) as tokenAndRefresh;
      next();
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        req.user = jwt.decode(accessToken as string) as tokenAndRefresh;
        next(e);
      } else {
        res.status(404).json({ errors: "Unauthorized" });
      }
    }
  }
};

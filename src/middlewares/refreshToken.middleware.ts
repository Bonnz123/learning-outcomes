import { tokenAndRefresh, UserRequest } from "../utils/token.util";
import { Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import { prismaClient } from "../app/database";

dotenv.config();

export const refreshToken = async (
  error: Error,
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (error instanceof TokenExpiredError) {
    const refreshToken = req.signedCookies["refreshToken"];
    if (!refreshToken) {
      res.status(404).json({ errors: "No refresh token found" });
    } else {
      try {
        const checkToken = await prismaClient.users.findUnique({
          where: {
            username: req.user?.username,
            token: refreshToken,
          },
        });
        if (checkToken == null) {
          res.status(404).json({ errors: "Unauthorized" });
        } else {
          const verifyToken = jwt.verify(
            refreshToken,
            process.env.SECRET_KEY_DATABASE as string
          ) as tokenAndRefresh;
          if (verifyToken.username !== req.user?.username) {
            throw new Error();
          } else {
            const newAccessToken = jwt.sign(
              { username: verifyToken.username },
              process.env.SECRET_KEY as string
            );
            req.user.newAccessToken = newAccessToken;
            next();
          }
        }
      } catch (e) {
        if (e instanceof TokenExpiredError) {
          await prismaClient.users.update({
            where: {
              username: req.user?.username,
            },
            data: {
              token: null,
            },
          });
          res.status(404).json({ errors: "Unauthorized" });
        } else {
          res.status(404).json({ errors: "Unauthorized" });
        }
      }
    }
  } else if (!error) {
    next();
  } else {
    next(error);
  }
};

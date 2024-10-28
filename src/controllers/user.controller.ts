import { Request, Response, NextFunction } from "express";
import {
  createUserRequest,
  loginUserRequest,
  updateUserRequest,
  userResponse,
} from "../models/user.model";
import { UserService } from "../services/user.service";
import { tokenAndRefresh, UserRequest } from "../utils/token.util";

export class userController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: userResponse = await UserService.register(
        req.body as createUserRequest
      );
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: userResponse = await UserService.login(
        req.body as loginUserRequest
      );
      const refreshToken: string = data.refreshToken as string;
      delete data.refreshToken;
      res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          signed: true,
        })
        .json(data);
    } catch (e) {
      next(e);
    }
  }

  static async get(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: userResponse = await UserService.get(
        req.user as tokenAndRefresh
      );
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  static async update(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await UserService.update(
        req.user as tokenAndRefresh,
        req.body as updateUserRequest
      );
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  static async logout(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await UserService.logout(req.user as tokenAndRefresh);
      res.status(200).json({
        data: "anda berhasil logout",
      });
    } catch (e) {
      next(e);
    }
  }
}

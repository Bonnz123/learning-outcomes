import { prismaClient, redis } from "../app/database";
import {
  createUserRequest,
  loginUserRequest,
  updateUserRequest,
  userResponse,
} from "../models/user.model";
import { toUserResponse } from "../utils/response.util";
import { userValidation } from "../validation/user.validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import { responseError } from "../utils/Error.util";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { users } from "@prisma/client";
import { tokenAndRefresh } from "../utils/token.util";
dotenv.config();

export class UserService {
  static async register(request: createUserRequest): Promise<userResponse> {
    const registerRequest = await Validation.validate(
      userValidation.register,
      request
    );
    const userUsed = await prismaClient.users.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (userUsed != 0) {
      throw new responseError("username is already use", 404);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const data = await prismaClient.users.create({
      data: registerRequest,
    });

    return toUserResponse(data);
  }

  static async login(request: loginUserRequest): Promise<userResponse> {
    const loginRequest = await Validation.validate(
      userValidation.login,
      request
    );

    const exist = await prismaClient.users.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!exist) {
      throw new responseError("username is wrong", 404);
    }

    const password = await bcrypt.compare(
      loginRequest.password,
      exist.password
    );

    if (!password) {
      throw new responseError("password is wrong", 404);
    }

    let refreshToken;
    if (!exist.token) {
      refreshToken = jwt.sign(
        { username: exist.username },
        process.env.SECRET_KEY_DATABASE as string,
        {
          expiresIn: "1 days",
        }
      );
      await prismaClient.users.update({
        where: {
          username: exist.username,
        },
        data: {
          token: refreshToken,
        },
      });
    }

    const accessToken = jwt.sign(
      { username: exist.username },
      process.env.SECRET_KEY as string,
      {
        expiresIn: "1h",
      }
    );

    const response = toUserResponse(exist);
    response.accessToken = accessToken;
    response.refreshToken = refreshToken || (exist.token as string);
    return response;
  }

  static async get(user: tokenAndRefresh): Promise<userResponse> {
    const getData = await redis.get(user.username)
    let data;
    if (getData) {
      data = JSON.parse(getData)
    } else {
      data = await prismaClient.users.findUnique({
        where: {
          username: user.username,
        },
      });
      await redis.setex(user.username, 3600, JSON.stringify(data));
    }
    return toUserResponse(data as users, user);
  }

  static async update(
    user: tokenAndRefresh,
    req: updateUserRequest
  ): Promise<userResponse> {
    const data = await Validation.validate(userValidation.update, req);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updateUser = await prismaClient.users.update({
      where: {
        username: user.username,
      },
      data,
    });

    await redis.del(user.username)

    return toUserResponse(updateUser, user);
  }

  static async logout(user: tokenAndRefresh): Promise<void> {
    await prismaClient.users.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });
  }
}

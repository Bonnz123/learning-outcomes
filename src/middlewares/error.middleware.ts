import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { responseError } from "../utils/Error.util";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res.status(404).json({
      errors: `Validation Error : ${JSON.stringify(error)}`,
    });
  } else if (error instanceof responseError) {
    res.status(error.status).json({
      errors: error.message,
    });
  } else {
    console.log(error);
    res.status(501).json({
      errors: "server error",
    });
  }
};

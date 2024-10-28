import express from "express";
import { publicRouter } from "../routes/publicApi";
import { errorMiddleware } from "../middlewares/error.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { apiRouter } from "../routes/api";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import { refreshToken } from "../middlewares/refreshToken.middleware";
dotenv.config()

export const app = express();
app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY_COOKIE));
app.use(publicRouter);
app.use(authMiddleware);
app.use(refreshToken)
app.use(apiRouter);
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("app start");
});

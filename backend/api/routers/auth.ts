import express, { NextFunction, Request, Response } from "express";
let router = express.Router();
const bcrypt = require("bcryptjs");
import { verify } from "jsonwebtoken";
import { User } from "../interface/user";
import { createAccessToken, createRefreshToken } from "../utils/create";
import { sendRefreshToken } from "../utils/sendRefreshToken";
import { isAuth } from "../middlewares/isAuth";

const USERNAME: string = process.env.USERNAME || "";
const HASHED_PASSWORD: string = process.env.HASHED_PASSWORD || "";

const USER: User = {
  USERNAME: USERNAME,
  HASHED_PASSWORD: HASHED_PASSWORD,
};

const domain: string =
  process.env.NODE_ENV === "development" ? "localhost" : "homeflix.youngjo.com";

const comparePasswords = async (password: string, _password: string) => {
  console.log("comparing password : ", password, HASHED_PASSWORD);
  return await bcrypt.compare(password, _password);
};

const clearCookie = (res: Response) => {
  return res.clearCookie("refreshToken", {
    domain: domain,
    path: process.env.COOKIE_PATH,
  });
};

router.post("/api/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log("user trying to login : ", username, password);

  // console.log(await bcrypt.hashSync(password, 10));

  if (username === USER.USERNAME) {
    const valid: boolean = await comparePasswords(
      password,
      USER.HASHED_PASSWORD
    );

    if (!valid) {
      console.log("비밀번호 검증 결과 : ", valid);

      return res.json({
        ok: false,
        message: "비밀번호가 틀렸습니다.",
      });
    }

    const refreshToken = createRefreshToken(USER);
    const accessToken = createAccessToken(USER);

    sendRefreshToken(res, refreshToken);

    return res.json({
      ok: true,
      message: "로그인 성공.",
      accessToken: accessToken,
      user: USER,
    });
  }
  console.log("User not exist");
  return res.send({ ok: false, message: "User not exist" });
});

router.post("/api/logout", (req: Request, res: Response) => {
  clearCookie(res);
  return res.send({
    ok: true,
    message: "Successfully logged out",
  });
});

const convertTime = (time: number) => {
  return new Date(time * 1000).toLocaleString();
};

router.post("/api/refresh_token", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    clearCookie(res);
    return res.send({
      ok: false,
      message: "No refresh token",
    });
  }

  let payload: any = null;

  try {
    payload = await verify(refreshToken, process.env.REFRESH_SECRET_KEY!);
  } catch (err) {
    return res.send({ ok: false, message: "Verify error" });
  }

  if (payload.USER.USERNAME !== USER.USERNAME) {
    console.log("User not exist");
    return res.send({ ok: false, message: "User not exist" });
  }

  console.log(
    "토큰 생성: ",
    convertTime(payload?.iat),
    "토큰 만료: ",
    convertTime(payload?.exp)
  );

  console.log("User exist");
  sendRefreshToken(res, createRefreshToken(USER));

  return res.send({
    ok: true,
    user: payload?.USER,
    exp: payload.exp * 1000,
    iat: payload.iat * 1000,
    accessToken: createAccessToken(USER),
  });
});

module.exports = router;

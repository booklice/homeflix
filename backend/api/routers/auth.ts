import express, { NextFunction, Request, Response } from "express";
let router = express.Router();
const bcrypt = require("bcryptjs");
const { pool } = require("../database/mysql");
import { verify } from "jsonwebtoken";
import { User } from "../interface/user";
import { createAccessToken, createRefreshToken } from "../utils/create";
import { sendRefreshToken } from "../utils/sendRefreshToken";
import { isAuth } from "../middlewares/isAuth";

const comparePasswords = async (password: string, _password: string) => {
  return await bcrypt.compare(password, _password);
};

const findOne = async (username: string) => {
  const [rows, fields] = await pool.query(
    `SELECT * FROM USER WHERE id = "${username}"`
  );
  if (!rows.length) {
    throw new Error("No Results");
  }
  return rows[0];
};

router.post("/api/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(req.body);
  const user: User = await findOne(username);
  const valid: boolean = await comparePasswords(password, user.password);

  if (!valid) {
    return res.json({
      ok: false,
      message: "비밀번호가 틀렸습니다.",
    });
  }

  const refreshToken = createRefreshToken(user);
  const accessToken = createAccessToken(user);

  sendRefreshToken(res, refreshToken);
  return res.json({
    ok: true,
    message: "로그인 성공.",
    accessToken: accessToken,
    user: user,
  });
});

router.post("/api/logout", (req: Request, res: Response) => {
  sendRefreshToken(res, "");
  res.clearCookie("refreshToken");
  return res.json({
    ok: true,
    message: "Successfully logged out",
  });
});

router.post("/refresh_token", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.send({
      ok: false,
      message: "No refresh token",
      accessToken: "",
    });
  }

  let payload: any = null;

  try {
    payload = verify(refreshToken, process.env.REFRESH_SECRET_KEY!);
  } catch (err) {
    return res.send({ ok: false, message: "Verify error" });
  }

  const user = await findOne(payload.user.id);

  if (!user) {
    return res.send({ ok: false, message: "User not exist" });
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res.send({
    ok: true,
    user: payload?.user,
    exp: payload.exp * 1000,
    iat: payload.iat * 1000,
    accessToken: createAccessToken(user),
  });
});

module.exports = router;

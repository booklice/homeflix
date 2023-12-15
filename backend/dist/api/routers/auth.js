"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
const bcrypt = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const create_1 = require("../utils/create");
const sendRefreshToken_1 = require("../utils/sendRefreshToken");
const USERNAME = process.env.USERNAME || "";
const HASHED_PASSWORD = process.env.HASHED_PASSWORD || "";
const USER = {
    USERNAME: USERNAME,
    HASHED_PASSWORD: HASHED_PASSWORD,
};
const domain = process.env.NODE_ENV === "development" ? "localhost" : "homeflix.youngjo.com";
const comparePasswords = (password, _password) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("comparing password : ", password, HASHED_PASSWORD);
    return yield bcrypt.compare(password, _password);
});
const clearCookie = (res) => {
    return res.clearCookie("refreshToken", {
        domain: domain,
        path: process.env.COOKIE_PATH,
    });
};
router.post("/api/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log("user trying to login : ", username, password);
    // console.log(await bcrypt.hashSync(password, 10));
    if (username === USER.USERNAME) {
        const valid = yield comparePasswords(password, USER.HASHED_PASSWORD);
        if (!valid) {
            console.log("비밀번호 검증 결과 : ", valid);
            return res.json({
                ok: false,
                message: "비밀번호가 틀렸습니다.",
            });
        }
        const refreshToken = (0, create_1.createRefreshToken)(USER);
        const accessToken = (0, create_1.createAccessToken)(USER);
        (0, sendRefreshToken_1.sendRefreshToken)(res, refreshToken);
        return res.json({
            ok: true,
            message: "로그인 성공.",
            accessToken: accessToken,
            user: USER,
        });
    }
    console.log("User not exist");
    return res.send({ ok: false, message: "User not exist" });
}));
router.post("/api/logout", (req, res) => {
    clearCookie(res);
    return res.send({
        ok: true,
        message: "Successfully logged out",
    });
});
const convertTime = (time) => {
    return new Date(time * 1000).toLocaleString();
};
router.post("/api/refresh_token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        clearCookie(res);
        return res.send({
            ok: false,
            message: "No refresh token",
        });
    }
    let payload = null;
    try {
        payload = yield (0, jsonwebtoken_1.verify)(refreshToken, process.env.REFRESH_SECRET_KEY);
    }
    catch (err) {
        return res.send({ ok: false, message: "Verify error" });
    }
    if (payload.USER.USERNAME !== USER.USERNAME) {
        console.log("User not exist");
        return res.send({ ok: false, message: "User not exist" });
    }
    console.log("토큰 생성: ", convertTime(payload === null || payload === void 0 ? void 0 : payload.iat), "토큰 만료: ", convertTime(payload === null || payload === void 0 ? void 0 : payload.exp));
    console.log("User exist");
    (0, sendRefreshToken_1.sendRefreshToken)(res, (0, create_1.createRefreshToken)(USER));
    return res.send({
        ok: true,
        user: payload === null || payload === void 0 ? void 0 : payload.USER,
        exp: payload.exp * 1000,
        iat: payload.iat * 1000,
        accessToken: (0, create_1.createAccessToken)(USER),
    });
}));
module.exports = router;

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
const { pool } = require("../database/mysql");
const jsonwebtoken_1 = require("jsonwebtoken");
const create_1 = require("../utils/create");
const sendRefreshToken_1 = require("../utils/sendRefreshToken");
const comparePasswords = (password, _password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.compare(password, _password);
});
const findOne = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows, fields] = yield pool.query(`SELECT * FROM USER WHERE id = "${username}"`);
    if (!rows.length) {
        throw new Error("No Results");
    }
    return rows[0];
});
router.post("/api/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log(req.body);
    const user = yield findOne(username);
    const valid = yield comparePasswords(password, user.password);
    if (!valid) {
        return res.json({
            ok: false,
            message: "비밀번호가 틀렸습니다.",
        });
    }
    const refreshToken = (0, create_1.createRefreshToken)(user);
    const accessToken = (0, create_1.createAccessToken)(user);
    (0, sendRefreshToken_1.sendRefreshToken)(res, refreshToken);
    return res.json({
        ok: true,
        message: "로그인 성공.",
        accessToken: accessToken,
        user: user,
    });
}));
router.post("/api/logout", (req, res) => {
    (0, sendRefreshToken_1.sendRefreshToken)(res, "");
    res.clearCookie("refreshToken");
    return res.json({
        ok: true,
        message: "Successfully logged out",
    });
});
router.post("/refresh_token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.send({
            ok: false,
            message: "No refresh token",
            accessToken: "",
        });
    }
    let payload = null;
    try {
        payload = (0, jsonwebtoken_1.verify)(refreshToken, process.env.REFRESH_SECRET_KEY);
    }
    catch (err) {
        return res.send({ ok: false, message: "Verify error" });
    }
    const user = yield findOne(payload.user.id);
    if (!user) {
        return res.send({ ok: false, message: "User not exist" });
    }
    (0, sendRefreshToken_1.sendRefreshToken)(res, (0, create_1.createRefreshToken)(user));
    return res.send({
        ok: true,
        user: payload === null || payload === void 0 ? void 0 : payload.user,
        exp: payload.exp * 1000,
        iat: payload.iat * 1000,
        accessToken: (0, create_1.createAccessToken)(user),
    });
}));
module.exports = router;

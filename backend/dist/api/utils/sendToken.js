"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = void 0;
const sendRefreshToken = (res, token) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
    });
};
exports.sendRefreshToken = sendRefreshToken;

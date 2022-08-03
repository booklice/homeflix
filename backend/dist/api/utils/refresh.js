"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = void 0;
const sendRefreshToken = (res, token) => {
    let options = {
        httpOnly: true,
        path: "/refresh_token",
    };
    res.cookie("refreshToken", token, options);
};
exports.sendRefreshToken = sendRefreshToken;

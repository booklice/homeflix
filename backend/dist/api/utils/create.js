"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createAccessToken = (USER) => {
    return (0, jsonwebtoken_1.sign)({ USER }, process.env.ACCESS_SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: "1m",
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (USER) => {
    return (0, jsonwebtoken_1.sign)({ USER }, process.env.REFRESH_SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: "10m",
    });
};
exports.createRefreshToken = createRefreshToken;

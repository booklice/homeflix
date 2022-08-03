"use strict";
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
module.exports = {
    sign: (user) => {
        // access token 발급
        const payload = {
            // access token에 들어갈 payload
            username: user.username,
            password: user.password,
        };
        return jwt.sign(payload, secret, {
            // secret으로 sign하여 발급하고 return
            algorithm: "HS256",
            expiresIn: "1h", // 유효기간
        });
    },
    verify: (token) => {
        // access token 검증
        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
            return {
                ok: true,
                username: decoded.username,
                password: decoded.password,
            };
        }
        catch (error) {
            return {
                ok: false,
                message: error.message,
            };
        }
    },
    refresh: () => {
        // refresh token 발급
        return jwt.sign({}, secret, {
            // refresh token은 payload 없이 발급
            algorithm: "HS256",
            expiresIn: "14d",
        });
    },
};

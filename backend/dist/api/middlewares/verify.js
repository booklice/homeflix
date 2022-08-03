"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        try {
            const bearerToken = bearerHeader.split(" ")[1];
            const { username } = (0, jsonwebtoken_1.verify)(bearerToken, process.env.ACCESS_SECRET_KEY);
            req.username = username;
            req.accessToken = bearerToken;
        }
        catch (error) {
            console.log(error);
            throw new Error("Not Authenticated");
        }
        return next();
    }
    else {
        res.status(403);
    }
};
exports.verifyToken = verifyToken;

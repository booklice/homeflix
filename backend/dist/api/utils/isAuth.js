"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const isAuth = (req, res, next) => {
    const authorization = req.headers["authorization"];
    // Check if bearer is undefined
    if (typeof authorization !== "undefined") {
        try {
            const accessToken = authorization.split(" ")[1];
            let payload = (0, jsonwebtoken_1.verify)(accessToken, process.env.ACCESS_SECRET_KEY);
            req.payload = payload;
            next();
        }
        catch (error) {
            res.status(403);
            res.send("Verify failed");
        }
    }
    else {
        // Forbidden
        res.status(403);
        res.send("No authorization");
    }
};
exports.isAuth = isAuth;

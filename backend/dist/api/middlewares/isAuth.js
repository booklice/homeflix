"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const isAuth = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
        return res.json({
            ok: false,
            message: "Not authenticated",
        });
    }
    try {
        const token = bearerHeader.split(" ")[1];
        const payload = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_SECRET_KEY);
        if (payload) {
            res.json({
                ok: true,
                message: "Authenticated",
            });
            return next();
        }
    }
    catch (error) {
        console.log(error);
        return res.json({
            ok: false,
            message: "Not authenticated",
        });
    }
};
exports.isAuth = isAuth;

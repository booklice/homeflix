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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    let payload = null;
    let verified = false;
    const secretKey = process.env.REFRESH_SECRET_KEY;
    try {
        payload = (0, jsonwebtoken_1.verify)(refreshToken, secretKey);
        console.log(payload);
    }
    catch (err) {
        return res.send({ ok: false, message: "Verify error", accessToken: "" });
    }
    if (verified) {
        next();
    }
    else {
        res.redirect("/login");
    }
});
exports.verifyToken = verifyToken;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors = require("cors");
const logger_1 = require("./api/middlewares/logger");
const videos = require("./api/routers/videos");
const auth = require("./api/routers/auth");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jsonwebtoken_1 = require("jsonwebtoken");
const app = (0, express_1.default)();
const PORT = process.env.PORT || "8080";
const corsOption = {
    origin: [
        "http://localhost:3000",
        "http://localhost:8080",
        "1.232.237.67",
        "http://127.0.0.1:3000",
        "http://127.0.0.8080",
        "http://localhost:9090",
    ],
    credentials: true, // Must specified to set cookies on client side
};
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express_1.default.json());
app.use(logger_1.logger);
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
// File protection
app.use("/videos", (req, res) => {
    const { file, accessToken } = req.query;
    console.log(file, accessToken);
    if (file && accessToken) {
        const url = `public/videos/${file}`;
        let payload = null;
        try {
            payload = (0, jsonwebtoken_1.verify)(accessToken, process.env.ACCESS_SECRET_KEY);
        }
        catch (err) {
            return res.sendStatus(403);
        }
        res.download(url);
    }
    else {
        return res.sendStatus(403);
    }
});
app.use("/videos", express_1.default.static("public/videos"));
app.use(auth);
app.use(videos);
app.get("/", (req, res) => {
    res.send("/");
});
app.listen(PORT, () => {
    console.log(`🛡️  Server listening on port: ${PORT} 🛡️`);
});

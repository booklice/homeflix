"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors = require("cors");
const videos = require("./api/routers/videos");
const auth = require("./api/routers/auth");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = (0, express_1.default)();
const PORT = process.env.PORT || "3000";
const corsOption = {
    origin: process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "https://homeflix.youngjo.com",
    credentials: true,
};
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express_1.default.json());
// app.use(logger);
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use(auth);
app.use(videos);
app.get("/", (req, res) => {
    res.send("/");
});
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

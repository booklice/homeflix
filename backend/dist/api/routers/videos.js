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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
const path = require("path");
const fs = require("fs");
const { isAuth } = require("../utils/isAuth");
const FILE_EXTENSION = [".MOV", ".MP4", ".mp4", ".avi"];
router.get("/api/videos", isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let videos = [];
        const files = fs.readdirSync("./public/videos");
        const file = fs.readFileSync("./public/info.json", "utf8");
        const json = JSON.parse(file);
        for (const file of files) {
            const isVideo = FILE_EXTENSION.includes(path.extname(file));
            if (isVideo) {
                const object = {
                    file: file,
                    url: `${process.env.BASE_URL}/videos/${file}`,
                };
                videos.push(object);
            }
        }
        let merged = videos.map((item, i) => Object.assign({}, item, json[i]));
        return res.status(200).send({ videos: merged });
    }
    catch (error) {
        console.log(error);
    }
}));
module.exports = router;

import express, { Request, Response } from "express";
let router = express.Router();
const path = require("path");
const fs = require("fs");
const { isAuth } = require("../utils/isAuth");

const FILE_EXTENSION: string[] = [".MOV", ".MP4", ".mp4", ".avi"];

interface AuthRequest extends Request {
  token?: string;
}

router.get("/api/videos", isAuth, async (req: AuthRequest, res: Response) => {
  try {
    let videos: object[] = [];
    const files: string[] = fs.readdirSync("./public/videos");
    const file = fs.readFileSync("./public/info.json", "utf8");
    const json = JSON.parse(file);

    for (const file of files) {
      const isVideo: boolean = FILE_EXTENSION.includes(path.extname(file));
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
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

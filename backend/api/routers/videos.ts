import express, { Request, Response } from "express";
import { verify } from "jsonwebtoken";
let router = express.Router();
const path = require("path");
const fs = require("fs");
const { isAuth } = require("../utils/isAuth");

interface AuthRequest extends Request {
  token?: string;
}

router.get("/api/video", (req: Request, res: Response) => {
  const { file, accessToken } = req.query;

  if (file && accessToken) {
    // URL 디코딩
    const decodedFileName = decodeURIComponent(file as string);
    // 공백으로 대체
    const fileNameWithSpaces = decodedFileName.replace(/_/g, " ");

    let payload: any = null;

    try {
      console.log("accessToken checking...");
      payload = verify(accessToken as string, process.env.ACCESS_SECRET_KEY!);
    } catch (error) {
      console.log(error);
      return res.sendStatus(403);
    }

    // 파일의 절대 경로를 생성
    const filePath = path.resolve(
      __dirname,
      "../../../public/videos",
      fileNameWithSpaces
    );

    return res.sendFile(filePath);
  } else {
    return res.status(400).send("Bad Request");
  }
});

router.get("/api/thumbnail", (req: Request, res: Response) => {
  const { file, accessToken } = req.query;

  if (file && accessToken !== null) {
    // URL 디코딩
    const decodedFileName = decodeURIComponent(file as string);
    // 공백으로 대체
    const fileNameWithSpaces = decodedFileName.replace(/_/g, " ");

    let payload: any = null;

    try {
      payload = verify(accessToken as string, process.env.ACCESS_SECRET_KEY!);
    } catch (error) {
      console.log(error);
      return res.sendStatus(403);
    }

    // 파일의 절대 경로를 생성
    const filePath = path.resolve(
      __dirname,
      "../../../public/videos",
      fileNameWithSpaces
    );

    return res.sendFile(filePath);
  } else {
    return res.status(400).send("Bad Request");
  }
});

interface Video {
  video: string;
  thumbnail: string;
}

router.get("/api/videos", isAuth, (req: AuthRequest, res: Response) => {
  try {
    const videoFiles: Video[] = [];

    fs.readdir("public/videos", (error: Error, files: string[]) => {
      if (error) {
        console.log("Error: " + error.message);
        res.status(500).send("Internal Server Error");
      } else {
        for (const file of files) {
          if (file.includes(".mp4")) {
            const modifiedFile: string = file.replace(/ /g, "_");
            const thumbnailFile: string = `${file
              .replace(/ /g, "_")
              .replace(/\.mp4$/, "")}-thumbnail.png`;
            // 응답에 썸네일 정보 추가

            const videoObject: Video = {
              video: modifiedFile,
              thumbnail: thumbnailFile,
            };
            videoFiles.push(videoObject);
          }
        }
        res.json(videoFiles);
      }
    });
  } catch (error) {
    console.log("Catch Error: " + error);
    res.status(500).send("Internal Server Error");
  }
});

// router.get(
//   "/api/search/:q",
//   isAuth,
//   async (req: AuthRequest, res: Response) => {
//     try {
//       let videos: object[] = [];
//       const files: string[] = fs.readdirSync("./public/videos");

//       // database json
//       const file = fs.readFileSync("./public/videos.json", "utf8");
//       const json = JSON.parse(file);

//       for (const file of files) {
//         const isVideo: boolean = FILE_EXTENSION.includes(path.extname(file));
//         if (isVideo) {
//           const object = {
//             file: file,
//             url: `${process.env.BASE_URL}/videos/${file}`,
//           };
//           videos.push(object);
//         }
//       }

//       let merged = videos.map((item, i) => Object.assign({}, item, json[i]));

//       const query = req.params.q;
//       const search = query.toLowerCase();

//       const filtered = merged.filter((video) => {
//         if (video.people.find((each: string) => each.includes(search))) {
//           return video;
//         } else if (video.theme.includes(search)) {
//           return video;
//         } else if (video.relation.includes(search)) {
//           return video;
//         } else if (video.location.includes(search)) {
//           return video;
//         } else if (video.description.includes(search)) {
//           return video;
//         } else {
//           return null;
//         }
//       });

//       return res.status(200).send({ ok: true, searchVideo: filtered });
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

module.exports = router;

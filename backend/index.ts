"use strict";

import express, { Application, NextFunction, Request, Response } from "express";
import "dotenv/config";
const cors = require("cors");
import { logger } from "./api/middlewares/logger";
const videos = require("./api/routers/videos");
const auth = require("./api/routers/auth");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
import { verify } from "jsonwebtoken";

const app: Application = express();
const PORT: string = process.env.PORT || "8080";

interface CorsOption {
  origin: string[];
  credentials: boolean;
}

const corsOption: CorsOption = {
  origin: [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.8080",
    "http://localhost:9090",
    "http://192.168.0.6:8080",
    "1.232.237.67:12907",
  ],
  credentials: true, // Must specified to set cookies on client side
};

app.use(cors(corsOption));
app.use(cookieParser());

app.use(express.json());
app.use(logger);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

// File protection
app.use("/videos", (req: Request, res: Response) => {
  const { file, accessToken } = req.query;
  console.log(file, accessToken);
  if (file && accessToken) {
    const url = `public/videos/${file}`;
    let payload: any = null;
    try {
      payload = verify(accessToken as string, process.env.ACCESS_SECRET_KEY!);
    } catch (err) {
      return res.sendStatus(403);
    }
    res.download(url);
  } else {
    return res.sendStatus(403);
  }
});

app.use("/videos", express.static("public/videos"));

app.use(auth);
app.use(videos);

app.get("/", (req: Request, res: Response) => {
  res.send("/");
});

app.listen(PORT, () => {
  console.log(`🛡️  Server listening on port: ${PORT} 🛡️`);
});

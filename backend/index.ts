"use strict";

import express, { Application, NextFunction, Request, Response } from "express";
import "dotenv/config";
const cors = require("cors");
import { logger } from "./api/middlewares/logger";
const videos = require("./api/routers/videos");
const auth = require("./api/routers/auth");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const app: Application = express();
const PORT: string = process.env.PORT || "3000";

interface CorsOption {
  origin: string;
  credentials: boolean;
}

const corsOption: CorsOption = {
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080"
      : "https://homeflix.youngjo.com",
  credentials: true,
};

app.use(cors(corsOption));
app.use(cookieParser());

app.use(express.json());
// app.use(logger);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use(auth);

app.use(videos);

app.get("/", (req: Request, res: Response) => {
  res.send("/");
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

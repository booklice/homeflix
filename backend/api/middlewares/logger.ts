import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  if (!req.originalUrl.includes("_next")) {
    console.log(
      `${req.method} ${req.protocol}://${req.get("host")}${
        req.originalUrl
      } - ${new Date(Date.now()).toLocaleString()}`
    );
  }

  next();
};

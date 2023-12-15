import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    console.log("no bearerHeader");
    return res.json({
      ok: false,
      message: "Not authenticated",
    });
  }

  try {
    const token: string = bearerHeader.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_SECRET_KEY as string);

    console.log(payload);
    if (payload) {
      res.json({
        ok: true,
        message: "Authenticated",
      });

      return next();
    }
  } catch (error) {
    return res.json({
      ok: false,
      message: "Not authenticated",
    });
  }
};

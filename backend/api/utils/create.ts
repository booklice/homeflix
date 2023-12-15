import { sign } from "jsonwebtoken";
import { User } from "../interface/user";

export const createAccessToken = (USER: User) => {
  return sign({ USER }, process.env.ACCESS_SECRET_KEY as string, {
    algorithm: "HS256",
    expiresIn: "1m",
  });
};

export const createRefreshToken = (USER: User) => {
  return sign({ USER }, process.env.REFRESH_SECRET_KEY as string, {
    algorithm: "HS256",
    expiresIn: "10m",
  });
};

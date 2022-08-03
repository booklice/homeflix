import { sign } from "jsonwebtoken";

interface User {
  username: string;
  password: string;
}

export const createAccessToken = (user: User) => {
  return sign({ user }, process.env.ACCESS_SECRET_KEY as string, {
    algorithm: "HS256",
    expiresIn: "1m",
  });
};

export const createRefreshToken = (user: User) => {
  return sign({ user }, process.env.REFRESH_SECRET_KEY as string, {
    algorithm: "HS256",
    expiresIn: "10m",
  });
};

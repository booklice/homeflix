import axios from "axios";
import { updateHeaders } from "./updateHeaders";
import Router from "next/router";
import { useAppContext } from "../context/Context";

let BASE_URL = null;

if (process.env.NODE_ENV === "development") {
  // 개발 모드에서 실행 중
  console.log("현재 개발 모드입니다.");
  BASE_URL = process.env.SERVER_URL;
} else {
  // 프로덕션 모드에서 실행 중
  console.log("현재 프로덕션 모드입니다.");
  BASE_URL = process.env.BASE_URL;
}

export const handleLogin = async (username, password) => {
  try {
    await axios(`${BASE_URL}/api/login`, {
      method: "POST",
      withCredentials: true,
      data: {
        username: username,
        password: password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.data.ok) {
        console.log("User logged in");
        const token = res.data.accessToken;
        Router.push(process.env.BASE_URL);
        updateHeaders(token);
      } else {
        alert(res.data.message);
      }
    });
  } catch (error) {
    console.log(error);
    console.log(error.message);
  }
};

export const handleLogout = async () => {
  try {
    await axios(`${BASE_URL}/api/logout`, {
      method: "POST",
      withCredentials: true,
    });
  } catch (error) {
    console.log(error);
  }
};

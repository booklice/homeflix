import axios from "axios";
import { updateHeaders } from "./updateHeaders";
import Router from "next/router";
import { useAppContext } from "../context/Context";

export const handleLogin = async (username, password) => {
  try {
    await axios(`${process.env.SERVER_URL}/api/login`, {
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
    console.log(error.message);
  }
};

export const handleLogout = async () => {
  try {
    await axios(`${process.env.SERVER_URL}/api/logout`, {
      method: "POST",
      withCredentials: true,
    });
  } catch (error) {
    console.log(error);
  }
};

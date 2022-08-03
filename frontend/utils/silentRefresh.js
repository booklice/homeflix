import axios from "axios";
import { updateHeaders } from "./updateHeaders";
import Router from "next/router";

export const silentRefresh = async () => {
  try {
    const res = await axios(`${process.env.SERVER_URL}/refresh_token`, {
      method: "POST",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (!res.data.ok) {
        Router.push(`${process.env.BASE_URL}/login`);
        throw Error("Invalid credentials");
      } else {
        return res;
      }
    });
    return res;
  } catch (error) {
    console.log(error.message);
    updateHeaders("");
  }
};

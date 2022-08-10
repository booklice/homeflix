import axios from "axios";
import { updateHeaders } from "./updateHeaders";

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
        throw Error("Invalid credentials");
      } else {
        const { accessToken } = res.data;
        updateHeaders(accessToken);
        return res;
      }
    });
    return res;
  } catch (error) {
    updateHeaders(null);
  }
};

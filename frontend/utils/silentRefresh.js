import axios from "axios";
import { updateHeaders } from "./updateHeaders";

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

export const silentRefresh = async () => {
  try {
    const res = await axios(`${BASE_URL}/api/refresh_token`, {
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

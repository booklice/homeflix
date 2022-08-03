import axios from "axios";

export const getVideos = async () => {
  try {
    const res = await axios(`${process.env.SERVER_URL}/api/videos`, {
      method: "GET",
      withCredentials: true,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getInfos = async () => {
  try {
    const res = await axios(`${process.env.SERVER_URL}/api/info`, {
      method: "GET",
      withCredentials: true,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

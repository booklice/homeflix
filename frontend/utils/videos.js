import axios from "axios";

export const getVideos = async () => {
  try {
    const res = await axios(`${process.env.SERVER_URL}/api/videos`, {
      method: "GET",
      withCredentials: true,
    });

    return res;
  } catch (error) {
    console.log(error.message);
  }
};

export const getSearchVideos = async (query) => {
  const checkHasIncode = (query) => {
    const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글인지 식별해주기 위한 정규표현식
    if (query.match(check_kor)) {
      const encodeKeyword = encodeURI(query); // 한글 인코딩
      return encodeKeyword;
    } else {
      return query;
    }
  };

  try {
    const res = await axios(
      `${process.env.SERVER_URL}/api/search/${checkHasIncode(query)}`,
      {
        method: "GET",
        withCredentials: true,
      }
    );

    return res;
  } catch (error) {
    console.log(error.message);
  }
};

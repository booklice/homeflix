import axios from "axios";

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

export const getVideos = async () => {
  try {
    const res = await axios(`${BASE_URL}/api/videos`, {
      method: "GET",
      withCredentials: true,
    });

    return res;
  } catch (error) {
    console.log(error.message);
  }
};

export const getVideo = async () => {
  try {
    const res = await axios(`${BASE_URL}/api/videos`, {
      method: "GET",
      withCredentials: true,
    });

    return res;
  } catch (error) {
    console.log(error.message);
  }
};

// export const getSearchVideos = async (query) => {
//   const checkHasIncode = (query) => {
//     const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글인지 식별해주기 위한 정규표현식
//     if (query.match(check_kor)) {
//       const encodeKeyword = encodeURI(query); // 한글 인코딩
//       return encodeKeyword;
//     } else {
//       return query;
//     }
//   };

//   try {
//     const res = await axios(`${BASE_URL}/api/search/${checkHasIncode(query)}`, {
//       method: "GET",
//       withCredentials: true,
//     });

//     return res;
//   } catch (error) {
//     console.log(error.message);
//   }
// };

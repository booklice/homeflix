import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export const getServerSideProps = async (context) => {
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

  const token = context.query.t;
  const file = encodeURIComponent(context.query.slug);
  const title = context.query.slug.replace(/_/g, " ").replace(/\.mp4$/, "");

  return {
    props: {
      title: title,
      video: `${BASE_URL}/api/video/?file=${file}&accessToken=${token}`,
      file: file,
      accessToken: token,
    },
  };
};

export default function Videos({ video, title }) {
  const [mouseMove, setMouseMove] = useState(false);
  const [mouseEnter, setMouseEnter] = useState(false);
  const [timer, setTimer] = useState(null);
  const interval = useRef(null);
  const router = useRouter();

  const handleMouseMove = (e) => {
    setMouseMove(true);
  };

  const handleBack = (e) => {
    e.preventDefault();
    router.push("../");
  };

  useEffect(() => {
    if (mouseMove) {
      clearInterval(interval.current);
    } else {
      let i = 2;

      interval.current = setInterval(() => {
        i--;
        setTimer(i);
        if (i === 0) {
          clearInterval(interval.current);
        }
      }, 1000);

      return () => {
        setMouseMove(false);
        setTimer(null);
        clearInterval(interval.current);
      };
    }
  }, [mouseMove, mouseEnter]);

  return (
    <div
      className="slug-container"
      onTouchStart={handleMouseMove}
      onMouseMove={handleMouseMove}
    >
      <div className="slug-container-header">
        <button onClick={handleBack} disabled={timer === 0 ? true : false}>
          뒤로
        </button>
        <span className="title">{title}</span>
      </div>
      <div className="video-container">
        <video controls muted controlsList="nodownload">
          <source type="video/mp4" src={video}></source>
        </video>
      </div>
      <style jsx>{`
        .slug-container {
          position: relative;
          width: 100%;
          height: 100%;
          background-color: black;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .slug-container-header {
          position: fixed;
          top: 0;
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 80px;
        }

        .title {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          color: white;
          opacity: ${timer !== 0 ? "1" : "0"};
          transition: opacity 1s linear;
        }

        .video-container {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        video {
          width: auto;
          height: 50%;
          z-index: 1;
        }

        button {
          width: 100px;
          height: 100%;
          color: white;
          background: none;
          border: none;
          opacity: ${timer !== 0 ? "1" : "0"};
          transition: opacity 1s linear;
          z-index: 2;
          cursor: ${timer !== 0 ? "pointer" : "auto"};
        }

        @media (max-width: 767px) {
          video {
            width: 100%;
            height: auto;
            z-index: 1;
          }

          .slug-container-header {
            height: 50px;
          }
        }
      `}</style>
    </div>
  );
}

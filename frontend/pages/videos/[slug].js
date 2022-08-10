import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export const getServerSideProps = async (context) => {
  const token = context.query.t;
  const file = context.query.slug;

  const url = `${process.env.SERVER_URL}/videos/?file=${file}&accessToken=${token}`;

  try {
    // try api with accessToken.
    const res = await axios(url);
  } catch (error) {
    // if there's error, and the error code status is 403, redirect 404 page.
    return {
      notFound: true,
    };
  }

  return {
    props: {
      video: url,
      file: file,
      accessToken: token,
    },
  };
};

export default function Videos({ video }) {
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
    <div className="slug-container">
      <video
        controls
        muted
        controlsList="nodownload"
        onMouseMove={handleMouseMove}
      >
        <source type="video/mp4" src={video}></source>
      </video>
      <button onClick={handleBack} disabled={timer === 0 ? true : false}>
        뒤로
      </button>
      <style jsx>{`
        .slug-container {
          position: relative;
          width: 100%;
          height: 100%;
          background-color: black;
        }
        video {
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        button {
          position: absolute;
          top: 0;
          left: 0;
          width: 70px;
          height: 70px;
          color: white;
          background: none;
          border: none;
          opacity: ${timer !== 0 ? "1" : "0"};
          transition: opacity 1s linear;
          z-index: 2;
          cursor: ${timer !== 0 ? "pointer" : "auto"};
        }
      `}</style>
    </div>
  );
}

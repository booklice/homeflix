import { handleLogout } from "../utils/auth";
import { useAppContext } from "../context/Context";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Search from "../components/Search";

const Header = () => {
  const router = useRouter();

  const { setUser, setIsRunning, interval, timeLeft } = useAppContext();

  const clickLogout = () => {
    clearInterval(interval.current);
    setUser(null);
    setIsRunning(false);
    handleLogout();
    router.push(`${process.env.BASE_URL}/login`);
  };

  return (
    <header>
      <div>타이틀</div>
      <Search />
      <div>
        <p>남은시간: {timeLeft ? timeLeft : ""}</p>
        <button onClick={clickLogout}>로그아웃</button>
      </div>
      <style jsx>{`
        header {
          position: relative;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: calc(100% - 400px) 200px 200px;
          padding: 5px;
        }

        header > div {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          z-index: 1;
        }

        header > div:nth-child(3) {
          text-align: right;
        }

        header > div > button {
          width: 100%;
          height: 100%;
          border: none;
          background: none;
          text-align: right;
        }
      `}</style>
    </header>
  );
};

export default Header;

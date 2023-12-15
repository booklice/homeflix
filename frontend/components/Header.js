import { handleLogout } from "../utils/auth";
import { useAppContext } from "../context/Context";
import { useRouter } from "next/router";

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
      <div className="logo-container">HOMEFLIX</div>
      {/* <Search /> */}
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
          grid-template-columns: calc(100% - 200px) 200px;
          justify-content: space-between;
          padding: 5px;
        }

        .logo-container,
        div:nth-child(2) {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          z-index: 1;
        }

        div:nth-child(2) {
          align-items: flex-end;
        }

        header > div > button {
          width: 100%;
          height: 100%;
          border: none;
          background: none;
          text-align: right;
          cursor: pointer;
        }
      `}</style>
    </header>
  );
};

export default Header;

import { createContext, useContext, useRef, useState, useEffect } from "react";
import { getInfos, getVideos } from "../utils/videos";
import { silentRefresh } from "../utils/silentRefresh";
import { updateHeaders } from "../utils/updateHeaders";
import Router from "next/router";
import { useRouter } from "next/router";
import { handleLogout } from "../utils/auth";

const AuthContext = createContext(null);

export const AppStateWrapper = ({ user, setUser, children }) => {
  const { pathname } = useRouter();
  const [videos, setVideos] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  let interval = useRef(null);
  let now = useRef(null);

  let props = {
    user: user,
    setUser: setUser,
    videos: videos,
    interval: interval,
    setIsRunning: setIsRunning,
    timeLeft: timeLeft,
  };

  const refresh = async () => {
    const res = await silentRefresh();
    if (res) {
      const { accessToken } = res.data;
      updateHeaders(accessToken);
      setUser(res.data);
    } else {
      updateHeaders("");
      setUser(null);
    }
  };

  const executeTimer = async () => {
    setIsRunning(true);
    interval.current = setInterval(() => {
      now.current = Date.now();
      let _timeLeft = Math.round((user.exp - now.current) / 1000);
      setTimeLeft(_timeLeft);
      if (_timeLeft <= 0) {
        clearInterval(interval.current);
        setIsRunning(false);
        setUser(null);
        setTimeLeft(null);

        handleLogout();

        if (confirm("로그인한지 시간이 꽤 지났네요.. 다시 로그인 하십시오.")) {
          Router.push(`${process.env.BASE_URL}/login`);
        }
      }
    }, 1000);

    return () => clearInterval(interval.current);
  };

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const res = await getVideos();
        if (res) {
          setVideos(res.data.videos);
        } else {
          setVideos(null);
        }
      };

      if (!isRunning) {
        executeTimer();
      }

      fetchData();
    } else {
      clearInterval(interval.current);
      interval.current = null;
    }
  }, [user, isRunning]);

  useEffect(() => {
    refresh();
  }, [pathname]);

  return <AuthContext.Provider value={props}>{children}</AuthContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AuthContext);
};

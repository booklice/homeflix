import { createContext, useContext, useRef, useState, useEffect } from "react";
import { getVideos } from "../utils/videos";
import { silentRefresh } from "../utils/silentRefresh";
import { updateHeaders } from "../utils/updateHeaders";
import Router from "next/router";
import { useRouter } from "next/router";
import { handleLogout } from "../utils/auth";

const AuthContext = createContext(null);

export const AppStateWrapper = ({ user, setUser, children }) => {
  const router = useRouter();
  const [videos, setVideos] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [fetched, setFetched] = useState(null);

  let interval = useRef(null);
  let now = useRef(null);

  let props = {
    user: user,
    setUser: setUser,
    videos: videos,
    interval: interval,
    timeLeft: timeLeft,
    setIsRunning: setIsRunning,
  };

  const refresh = async () => {
    const res = await silentRefresh();
    if (res) {
      setUser(res.data);
    } else {
      router.push(`/login`);
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

        if (confirm("로그인한지 시간이 꽤 지났네요. 다시 로그인 하세요.")) {
          Router.push(`/login`);
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
          setVideos(res.data);
        } else {
          setVideos(null);
        }
      };

      if (!isRunning) {
        executeTimer();
      }

      if (!fetched) {
        fetchData();
        setFetched(true);
      }
    } else {
      clearInterval(interval.current);
      interval.current = null;
    }
  }, [user, isRunning]);

  useEffect(() => {
    refresh();
  }, [router.asPath]);

  return <AuthContext.Provider value={props}>{children}</AuthContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AuthContext);
};

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../context/Context";
import { handleLogin, handleLogout } from "../utils/auth";

export default function Login() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const router = useRouter();
  const { user, setUser, setIsRunning, interval } = useAppContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else setPassword(value);
  };

  return (
    <div className="login-container">
      <div className="form-container">
        {user !== null ? (
          <div>
            <p>
              <input
                type="button"
                value="로그아웃"
                onClick={(e) => {
                  e.preventDefault();
                  clearInterval(interval.current);
                  setUser(null);
                  setIsRunning(false);
                  handleLogout();
                  router.push(`${process.env.BASE_URL}/login`);
                }}
              />
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(username, password);
            }}
          >
            <input
              className="input-username"
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="아이디"
            ></input>
            <input
              className="input-password"
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="비밀번호"
            ></input>
            <input type="submit" value="로그인" />
          </form>
        )}
      </div>
      <style jsx>{`
        .login-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-container {
          position: relative;
          width: 300px;
          min-width: 200px;
          display: flex;
          flex-direction: column;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        p {
          font-weight: 600;
          letter-spacing: 4px;
        }

        input {
          letter-spacing: 4px;
          font-size: 1rem;
          font-weight: 600;
          padding: 5px;
          height: 30px;
          border: none;
          border-bottom: 1px solid black;
          background: none;
        }

        input[type="submit"],
        input[type="button"] {
          border: 1px solid black;
          width: 100%;
          height: 30px;
        }
      `}</style>
    </div>
  );
}

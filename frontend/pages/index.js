import Link from "next/link";
import { useAppContext } from "../context/Context";
import { useRouter } from "next/router";
import { handleLogout } from "../utils/auth";

export default function Home() {
  const router = useRouter();

  const { user, setUser, videos, setIsRunning, interval, timeLeft } =
    useAppContext();

  return (
    <div className="home-container">
      <ul>
        {videos
          ? videos.map((each, i) => (
              <Link
                href={`/videos/${each.file}?t=${
                  user ? user.accessToken : null
                }`}
              >
                <li key={i}>
                  <p>{each.file}</p>
                  <p>{each.description}</p>
                </li>
              </Link>
            ))
          : ""}
      </ul>
      <style jsx>{`
        ul {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-auto-rows: 300px;
          padding: 5px;
        }

        li {
          border: 1px solid black;
          list-style: none;
          transition: border-radius 0.5s linear;
          cursor: pointer;
          border-radius: 50%;
        }

        li:hover {
          border-radius: 0%;
        }
      `}</style>
    </div>
  );
}

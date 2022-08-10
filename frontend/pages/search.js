import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { getSearchVideos } from "../utils/videos";
import List from "../components/List";
import { useAppContext } from "../context/Context";

export default function search({ props }) {
  const [result, setResult] = useState(null);
  const { user } = useAppContext();

  const timeout = useRef(null);

  const router = useRouter();

  const search = router.query.q;

  useEffect(() => {
    if (router.asPath) {
      router.replace(`${process.env.BASE_URL}/search?q=${search}`);
      timeout.current = setTimeout(async () => {
        const result = await getSearchVideos(search);
        if (result.data.ok) {
          setResult(result.data.searchVideo);
        }
      }, 1500);
      return () => clearTimeout(timeout.current);
    } else {
      router.replace(process.env.BASE_URL);
      timeout.current = null;
    }
  }, [router.asPath]);

  return (
    <div className="search-container">
      <List user={user} videos={result} />
      {result && result.length === 0
        ? `${search}검색 결과가 존재하지 않습니다.`
        : ""}
      <style jsx>{`
        button {
          background: none;
          border: none;
        }
      `}</style>
    </div>
  );
}

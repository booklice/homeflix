import { useAppContext } from "../context/Context";
import List from "../components/List";

export default function Home() {
  const { user, videos } = useAppContext();

  return (
    <div className="home-container">
      <List user={user} videos={videos} />
    </div>
  );
}

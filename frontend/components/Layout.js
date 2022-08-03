import { AppStateWrapper } from "../context/Context";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";

export default function Layout({ children, props }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const setHeight = () => {
    document.documentElement.style.setProperty(
      "--app-height",
      `${window.innerHeight}px`
    );
  };

  useEffect(() => {
    setHeight();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Homeflix</title>
        <meta name="description" content="Homeflix" />
      </Head>
      <AppStateWrapper user={user} setUser={setUser}>
        {router.pathname === "/" && <Header />}
        <main>{children}</main>
      </AppStateWrapper>
      <style jsx>{`
        .container {
          width: 100%;
          height: var(--app-height);
        }

        main {
          position: relative;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}

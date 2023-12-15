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

  const layoutVisible =
    router.pathname === "/" || router.pathname === "/search";

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
        {layoutVisible && <Header />}
        <main>{children}</main>
      </AppStateWrapper>
      <style jsx>{`
        .container {
          width: 100%;
          height: var(--app-height);
          display: grid;
          grid-template-rows: ${layoutVisible
            ? `50px calc(100% - 50px)`
            : "var(--app-height)"};

          font-size: 1em;
        }

        main {
          position: relative;
          width: 100%;
          height: 100%;
        }

        @media (max-width: 767px) {
          .container {
            font-size: 0.8em;
          }
        }
      `}</style>
    </div>
  );
}

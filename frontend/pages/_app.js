import "../styles/globals.css";
import Layout from "../components/Layout";
import Loading from "../components/Loading";

function MyApp({ Component, pageProps }) {
  return (
    <Layout props={pageProps}>
      {/* <Loading /> */}
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

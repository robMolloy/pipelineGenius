import { Layout } from "@/modules/layout";
import { useThemes } from "@/modules/themeSelector";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "highlight.js/styles/default.css";
import { Notify } from "@/modules/notify";
export default function App({ Component, pageProps }: AppProps) {
  useThemes();
  return (
    <>
      <Head>
        <title>Pipeline Genius</title>
      </Head>

      <Notify />

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

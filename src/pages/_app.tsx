import { Layout } from "@/modules/layout";
import { useThemes } from "@/modules/themeSelector";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  useThemes();
  return (
    <>
      <Head>
        <title>Pipeline Genius</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

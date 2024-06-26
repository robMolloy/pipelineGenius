import { auth } from "@/firebase-config";
import { Layout } from "@/modules/layout";
import { Notify } from "@/modules/notify";
import { useThemes } from "@/modules/themeSelector";
import { useUserStore } from "@/stores/useUserStore";
import "@/styles/globals.css";
import { onAuthStateChanged } from "firebase/auth";
import "highlight.js/styles/default.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useThemes();
  const userStore = useUserStore();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      userStore.setUser(user);
    });
  }, []);
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

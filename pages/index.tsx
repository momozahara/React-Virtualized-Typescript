import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const Virtualize = dynamic(() => import("components/virtualize"), {
  ssr: false,
});

const Home = () => {
  return (
    <>
      <Head>
        <title>React Virtualized Typescript</title>
        <meta
          name="description"
          content="A Pcode Website"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      <Virtualize />
    </>
  );
};

export default Home;

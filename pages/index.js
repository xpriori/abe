import Head from "next/head";
import React, { useEffect } from "react";
import Router from "next/router";
export default function Main() {
  useEffect(() => {
    const timer = setTimeout(() => {
      Router.push("/dashboard");
    }, 1000);
    return () => {
      timer;
    };
  }, []);
  return (
    <div>
      <Head>
        <title>Project Eve - AI Assisted Reporting</title>
        <link rel="icon" href="../logo_perfect.png" />
      </Head>
    </div>
  );
}

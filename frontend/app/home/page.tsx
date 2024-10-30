import Head from "next/head";
import Header from "@/components/Header";
import React from "react";
import LinksButtons from "@/app/home/LinksButtons";

export default function Home() {
  return (
    <>
  <Head>
    <title>BookHub - A Social Network for Book Lovers</title>
    <meta
      name="description"
      content="BookHub is a social network where book lovers can connect, explore, and discuss their favorite books."
    />
  </Head>

  <div
    className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 to-blue-200"
  >
    <Header />

    <h1 className="text-4xl font-bold mt-8">WELCOME!</h1>

    <p className="text-lg text-gray-700 mt-4 text-center max-w-md">
      Discover, share, and discuss books with fellow book enthusiasts on BookHub.
      Connect with others, find new reads, and immerse yourself in the world of literature.
    </p>

    <LinksButtons></LinksButtons>
  </div>
</>

  );
}

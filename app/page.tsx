import Header from "./components/Header";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Schedule from "./components/Schedule";
import Contact from "./components/Contact";
import Link from "next/link";

import Head from "next/head";

import { getSchedule } from "./lib/prisma";
import Script from "next/script";

export default async function Home() {
  const schedule = await getSchedule();

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_KEY}`}
        strategy="beforeInteractive"
      />
      <Link href="/" className="focus:outline-none">
        <Header />
      </Link>
      <Navbar />
      <main className="pb-8">
        <div className="container mx-auto">
          <About />
          <Schedule schedule={schedule} />
        </div>
        <Contact />
      </main>
    </>
  );
}

export const revalidate = false;

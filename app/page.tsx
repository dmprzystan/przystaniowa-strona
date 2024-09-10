import Header from "./components/Header";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Schedule from "./components/Schedule";
import Contact from "./components/Contact";
import Link from "next/link";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import { getSchedule } from "./lib/prisma";
import Script from "next/script";

export default async function Home() {
  const schedule = await getSchedule();

  return (
    <>
      <Script
        src={`https://challenges.cloudflare.com/turnstile/v0/api.js`}
        async={true}
        defer={true}
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

      <SpeedInsights />
      <Analytics />
    </>
  );
}

export const revalidate = false;

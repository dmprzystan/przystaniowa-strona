import Header from "./components/Header";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Schedule from "./components/Schedule";
import Contact from "./components/Contact";
import Link from "next/link";

import { GoogleAnalytics } from "@next/third-parties/google";

import { getSchedule } from "./lib/prisma";

export default async function Home() {
  const schedule = await getSchedule();

  return (
    <>
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
      <GoogleAnalytics gaId="G-X396CLQTK4" />
    </>
  );
}

export const revalidate = false;

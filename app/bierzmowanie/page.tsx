import Link from "next/link";
import { Inter } from "next/font/google";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import "./style.scss";
import { readFile } from "@/app/lib/b2";
import { getConfirmationLinks } from "../lib/prisma";

const inter = Inter({
  subsets: ["latin-ext"],
});

export default async function Page() {
  const confirmation = await readFile("bierzmowanie/bierzmowanie.html");
  const links = await getConfirmationLinks();

  return (
    <>
      <Link href="/" className="focus:outline-none">
        <Header />
      </Link>
      <Navbar />
      <div className="container mx-auto pb-8">
        <main className="pt-4 md:pt-6 lg:pt-8 xl:pt-12 mt-8 sm:mt-4 bg-dimmedBlue pb-8 rounded-t-2xl">
          <h2 className="text-white text-3xl sm:text-4xl xl:text-5xl uppercase text-center">
            bierzmowanie
          </h2>
          <div
            className={`bierzmowanie ${inter.className}`}
            dangerouslySetInnerHTML={{ __html: confirmation }}
          />
          <div className="flex flex-col sm:flex-row items-stretch w-fit mx-auto gap-6 mt-6 md:text-lg lg:text-2xl xl:text-3xl uppercase">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                className="block bg-[#D9D9D9] px-8 lg:px-10 py-3 lg:py-4 rounded-xl shadow-lg text-center"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </main>
        <img
          src="/images/bg-contact-bottom.svg"
          alt=""
          className="w-full -mt-px"
        />
      </div>

      <SpeedInsights />
      <Analytics />
    </>
  );
}

export const revalidate = false;

import Link from "next/link";
import { getNewspapers } from "@/app/lib/prisma";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { Inter } from "next/font/google";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  weight: ["400", "800"],
  subsets: ["latin", "latin-ext"],
});

const months = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

async function page() {
  const newspapers = await getNewspapers();

  return (
    <>
      <Link href="/" className="focus:outline-none">
        <Header />
      </Link>
      <Navbar />
      <div className="container mx-auto pb-8 pt-4 md:pt-6 lg:pt-8 xl:pt-12 mt-8 sm:mt-4">
        <h2 className="text-3xl sm:text-4xl xl:text-5xl text-center">
          GAZETKA 19tka
        </h2>
        <div
          className={`px-8 md:px-16 xl:px-32 grid gap-12 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 mt-8 md:mt-16`}
        >
          {newspapers.map((newspaper) => (
            <a
              key={newspaper.id}
              className="bg-[#A9C3AC] flex flex-col px-16 py-28 rounded-3xl shadow-2xl"
              href={`/public/${newspaper.url}`}
              download
              target="_blank"
            >
              <h3 className="text-xl text-center uppercase">
                nr{" "}
                <span className="text-5xl font-extrabold">
                  {newspaper.title}
                </span>
              </h3>
              <div className="flex flex-col items-center uppercase mt-4">
                <p className="text-xl">{months[newspaper.date.getMonth()]}</p>
                <p className="text-lg">{newspaper.date.getFullYear()}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <SpeedInsights />
      <Analytics />
    </>
  );
}

export const revalidate = false;

export default page;

import Link from "next/link";
import { getGallery } from "@/app/lib/prisma";
import React from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import "./style.scss";

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
  const albums = await getGallery();
  return (
    <>
      <Link href="/" className="focus:outline-none">
        <Header />
      </Link>
      <Navbar />
      <div className="container mx-auto pb-8 pt-4 md:pt-6 lg:pt-8 xl:pt-12 mt-8 sm:mt-4">
        <h2 className="text-3xl sm:text-4xl xl:text-5xl text-center">
          GALERIA
        </h2>
        <div
          className={`px-8 md:px-16 xl:px-32 gallery grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 mt-8 md:mt-16`}
        >
          {albums.map(
            (album) =>
              album.thumbnail && (
                <Link
                  key={album.id}
                  className="flex flex-col gap-4 px-2 py-2 hover:shadow-arround duration-300 transition-all rounded-3xl overflow-hidden justify-end"
                  href={`/galeria/${album.id}`}
                >
                  <div className="w-full h-full rounded-3xl overflow-hidden">
                    <img
                      src={`/galeria/img/${album.thumbnail.url}`}
                      alt=""
                      className="block rounded-3xl object-cover shadow-xl h-full w-full"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <h3 className="text-3xl font-extrabold text-center uppercase whitespace-nowrap text-ellipsis w-full overflow-hidden">
                      {album.title}
                    </h3>
                    <p className="text-xl">
                      <span className="font-bold">
                        {months[album.date.getMonth()]}
                      </span>
                      <span> </span>
                      <span className="font-light">
                        {album.date.getFullYear()}
                      </span>
                    </p>
                  </div>
                </Link>
              )
          )}
        </div>
      </div>

      <SpeedInsights />
      <Analytics />
    </>
  );
}

export const revalidate = false;

export default page;

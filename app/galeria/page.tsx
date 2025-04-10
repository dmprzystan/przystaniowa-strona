import Link from "next/link";
import { getGallery } from "@/app/lib/prisma";
import React from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import AlbumThumbnail from "./components/AlbumThumbnail";
import "./style.scss";

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
        <div className="gallery grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 mt-8 md:mt-16">
          {albums.map(
            (album) =>
              (album.thumbnail || album.photos[0]) && (
                <Link
                  key={album.id}
                  className="col-span-1"
                  href={`/galeria/${album.id}`}
                >
                  <AlbumThumbnail album={album} />
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

import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";

import "../style.scss";

import { getAlbum, getGallery } from "@/app/lib/prisma";

export async function generateStaticParams() {
  const albums = await getGallery();
  return albums.map((album) => ({
    params: { id: album.id },
  }));
}

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

export default async function Plan({ params }: { params: { id: string } }) {
  const album = await getAlbum(params.id);

  const date = (date: Date) => {
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <>
      <Link href="/" className="focus:outline-none">
        <Header />
      </Link>
      <Navbar />
      <div className="container mx-auto pb-8 pt-4 md:pt-6 lg:pt-8 xl:pt-12 mt-8 sm:mt-4">
        <div className="flex flex-col gap-3 items-center justify-center flex-wrap w-full overflow-hidden">
          <h2 className="text-4xl text-center font-semibold overflow-hidden w-full">
            {album.title}
          </h2>
          <p className="font-light text-xl">{date(album.date)}</p>
        </div>
        {album.description && (
          <div>
            <hr className="my-4" />
            <p className="text-center">{album.description}</p>
          </div>
        )}
        <div className="mt-8 masonry grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 px-4">
          {album.AlbumPhoto.map((photo, i) => (
            <div key={photo.id} className={photo.size.toLowerCase()}>
              <img
                src={`/galeria/img/${photo.url}`}
                alt={photo.url}
                className={`w-full h-full object-cover rounded-lg`}
                key={photo.id}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export const revalidate = false;

import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { redirect } from "next/navigation";

import "../style.scss";

import { getAlbum, getGallery } from "@/app/lib/prisma";
import AlbumImage from "./AlbumImage";

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

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let album;
  try {
    album = await getAlbum(params.id);
  } catch (e) {
    redirect("/admin/galeria");
  }

  const date = (date: Date) => {
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <>
      <Link href="/" className="focus:outline-none">
        <Header />
      </Link>
      <Navbar />
      {!album && redirect("/galeria")}
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
          {album.photos.map((photo) => (
            <AlbumImage key={photo.id} photo={photo} />
          ))}
        </div>
      </div>
    </>
  );
}

export const revalidate = false;

"use client";

import React from "react";
import NewAlbum from "./NewAlbum";
import { Album } from "@/app/lib/prisma";
import Link from "next/link";

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

function Galeria(props: { gallery: Album[] }) {
  const [gallery, setGallery] = React.useState(props.gallery);
  const [newAlbum, setNewAlbum] = React.useState(false);

  const date = (date: Date) => {
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const fetchGallery = async () => {
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();

    const parsedData = data
      .map((album: Album) => ({
        ...album,
        date: new Date(album.date),
      }))
      .sort((a: Album, b: Album) => b.date.valueOf() - a.date.valueOf());

    setGallery(parsedData);
  };

  return (
    <>
      <div className="px-4 sm:px-16 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl text-center">Galeria</h2>
          <button
            className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
            onClick={() => {
              setNewAlbum(true);
            }}
          >
            Nowy album
          </button>
        </div>
        <div className="mt-8 flex flex-wrap gap-y-8">
          {gallery.map((album) => (
            <div key={album.id} className="max-w-[50%] flex-[1 1 50%] px-4">
              <Link
                href={`/admin/galeria/${album.id}`}
                className="block relative overflow-hidden rounded-3xl w-fit shadow-none hover:shadow-lg transition-all cursor-pointer duration-300"
              >
                <div className="absolute z-10 bg-white bg-opacity-60 backdrop-blur-lg w-full bottom-0 left-0 px-4 py-4 flex items-center gap-3">
                  <h3 className="text-2xl drop-shadow-md font-bold">
                    {album.title}
                  </h3>
                  <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                  <p className="font-light">{date(album.date)}</p>
                </div>
                <img
                  src={
                    album.AlbumPhoto[0]
                      ? `/galeria/img/${album.AlbumPhoto[0].url}`
                      : `https://picsum.photos/600/400/?blur=6?random=${album.id}`
                  }
                  alt=""
                  className="w-full h-auto"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      {newAlbum && (
        <NewAlbum onClose={() => setNewAlbum(false)} onSubmit={fetchGallery} />
      )}
    </>
  );
}

export default Galeria;

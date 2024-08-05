"use client";

import React from "react";
import NewAlbum from "./NewAlbum";
import { Album } from "@/app/lib/prisma";
import Link from "next/link";

import "@/app/galeria/style.scss";

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
        <div className="gallery grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 mt-8 md:mt-16">
          {gallery.map((album) => (
            <Link
              key={album.id}
              className="flex flex-col gap-4 px-2 py-2 hover:shadow-arround duration-300 transition-all rounded-3xl overflow-hidden justify-end"
              href={`/admin/galeria/${album.id}`}
            >
              <div className="w-full h-full rounded-3xl overflow-hidden">
                <img
                  src={`/galeria/img/${album.AlbumPhoto[0].url}`}
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
                  <span className="font-light">{album.date.getFullYear()}</span>
                </p>
              </div>
            </Link>
            // <div key={album.id} className="flex w-full">
            //   <Link
            //     href={`/admin/galeria/${album.id}`}
            //     className="block relative overflow-hidden rounded-3xl shadow-none hover:shadow-lg transition-all cursor-pointer duration-300 w-full"
            //   >
            //     <div className="absolute z-10 bg-white bg-opacity-60 backdrop-blur-lg w-full bottom-0 left-0 px-4 py-4 flex items-center gap-3">
            //       <h3 className="text-2xl drop-shadow-md font-bold">
            //         {album.title}
            //       </h3>
            //       <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
            //       <p className="font-light">{date(album.date)}</p>
            //     </div>
            //     <img
            //       src={
            //         album.AlbumPhoto[0]
            //           ? `/galeria/img/${album.AlbumPhoto[0].url}`
            //           : `https://picsum.photos/600/400/?blur=6?random=${album.id}`
            //       }
            //       alt=""
            //       className="w-full h-full object-cover"
            //     />
            //   </Link>
            // </div>
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

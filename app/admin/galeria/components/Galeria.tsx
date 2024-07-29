"use client";

import React from "react";
import Album from "./Album";

function Galeria() {
  const [albums, setAlbums] = React.useState([
    {
      name: "Album 1",
      photos: [
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 1" },
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 2" },
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 3" },
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 3" },
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 3" },
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 3" },
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 3" },
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 3" },
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 3" },
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 3" },
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 3" },
      ],
    },
    {
      name: "Album 2",
      photos: [
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 1" },
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 2" },
        { src: "https://via.placeholder.com/150", alt: "Zdjęcie 3" },
      ],
    },
  ]);

  return (
    <div className="px-4 sm:px-16 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl text-center">Galeria</h2>
        <button className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all">
          Nowy album
        </button>
      </div>
      <div className="mt-8 flex flex-col gap-8">
        {albums.map((album) => (
          <Album key={album.name} album={album} />
        ))}
      </div>
    </div>
  );
}

export default Galeria;

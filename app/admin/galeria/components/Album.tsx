import React from "react";

type AlbumProps = {
  album: {
    name: string;
    photos: { src: string; alt: string }[];
  };
};

import { AddRounded, ArrowForwardIosRounded } from "@mui/icons-material";
import Link from "next/link";

function Album({ album }: AlbumProps) {
  return (
    <div>
      <Link
        href={`/admin/galeria/${album.name}`}
        className="flex items-center gap-2 hover:font-bold"
      >
        <h3 className="text-2xl">{album.name}</h3>
        <ArrowForwardIosRounded />
      </Link>
      <div className="mt-2 flex gap-4 overflow-x-scroll scroll-smooth scrollbar-none">
        {album.photos.map((photo) => (
          <img
            className="rounded-lg"
            key={`${photo.src}-${photo.alt}`}
            src={photo.src}
            alt={photo.alt}
          />
        ))}
        <button className="flex items-center justify-center w-32 bg-[#C0C0C0] rounded-lg hover:bg-[#A0A0A0] transition-all duration-200">
          <div className="px-2 py-2 rounded-full bg-white">
            <AddRounded />
          </div>
        </button>
      </div>
    </div>
  );
}

export default Album;

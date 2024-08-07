"use client";

import { AlbumPhoto } from "@/app/lib/prisma";
import React from "react";
import Image from "next/image";

function AlbumImage({ photo }: { photo: AlbumPhoto }) {
  return (
    <div key={photo.id} className={`${photo.size.toLowerCase()} relative`}>
      <Image
        onLoad={() => {
          console.log("Loaded");
        }}
        src={`/galeria/img/${photo.url}`}
        width={photo.size === "BIG" || photo.size === "WIDE" ? 800 : 400}
        height={photo.size === "BIG" || photo.size === "TALL" ? 600 : 300}
        alt={photo.url}
        className={`w-full h-full object-cover rounded-lg`}
        key={photo.id}
      />
    </div>
  );
}

export default AlbumImage;

"use client";

import { AlbumPhoto } from "@/app/lib/prisma";
import React, { Suspense, use, useEffect } from "react";
import Image from "next/image";

function AlbumImage({ photo }: { photo: AlbumPhoto }) {
  const [loaded, setLoaded] = React.useState(false);
  const [startLoading, setStartLoading] = React.useState(false);

  useEffect(() => {
    setStartLoading(true);
  }, []);

  return (
    <div className={`${photo.size.toLowerCase()} relative`}>
      {/* {!loaded && (
        <div className="absolute left-0 top-0 rounded-lg h-full w-full bg-black"></div>
      )}
      {startLoading && (
        <img
          loading="lazy"
          src={`/galeria/img/${photo.url}`}
          width={photo.size === "BIG" || photo.size === "WIDE" ? 800 : 400}
          height={photo.size === "BIG" || photo.size === "TALL" ? 600 : 300}
          alt=""
          className={`w-full h-full object-cover rounded-lg ${
            loaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500`}
          onLoad={(e) => {
            console.log("loaded");
            setLoaded(true);
          }}
        />
      )} */}
      <Image
        src={`/galeria/img/${photo.url}`}
        width={photo.size === "BIG" || photo.size === "WIDE" ? 800 : 400}
        height={photo.size === "BIG" || photo.size === "TALL" ? 600 : 300}
        alt={photo.url}
        className={`w-full h-full object-cover rounded-lg`}
        placeholder="blur"
        blurDataURL={`/galeria/img/${photo.preview}`}
      />
    </div>
  );
}

export default AlbumImage;

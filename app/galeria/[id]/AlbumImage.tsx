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
      <Image
        src={`/public/${photo.url}`}
        width={photo.size === "BIG" || photo.size === "WIDE" ? 800 : 400}
        height={photo.size === "BIG" || photo.size === "TALL" ? 600 : 300}
        alt={photo.url}
        className={`w-full h-full object-cover rounded-lg`}
        // placeholder="blur"
      />
    </div>
  );
}

export default AlbumImage;

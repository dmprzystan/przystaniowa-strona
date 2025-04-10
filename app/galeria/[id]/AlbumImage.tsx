"use client";

import { AlbumPhoto } from "@/app/lib/prisma";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

function AlbumImage({ photo }: { photo: AlbumPhoto }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className={`${photo.size.toLowerCase()} relative`}>
      {loading && <Skeleton className="w-full h-full absolute" />}
      <img
        src={`/public/${photo.url}`}
        width={photo.size === "BIG" || photo.size === "WIDE" ? 800 : 400}
        height={photo.size === "BIG" || photo.size === "TALL" ? 600 : 300}
        alt={photo.url}
        className={`w-full h-full object-cover rounded-lg absolute`}
        loading="lazy"
        onLoad={() => {
          setLoading(false);
        }}
      />
    </div>
  );
}

export default AlbumImage;

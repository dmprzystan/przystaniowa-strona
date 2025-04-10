"use client";

import React, { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Album } from "@/app/lib/prisma";
import { Card } from "@/components/ui/card";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import { Skeleton } from "@/components/ui/skeleton";

dayjs.locale("pl");

function AlbumThumbnail({ album }: { album: Album }) {
  const [loading, setLoading] = useState(true);
  return (
    <Card className="h-full w-full relative overflow-hidden hover:shadow-arround transition-all duration-200">
      <AspectRatio ratio={4 / 3}>
        <div className="relative w-full h-full">
          {loading && <Skeleton className="w-full h-full absolute" />}
          <img
            src={`/public/${album.thumbnail?.url || album.photos[0].url}`}
            alt=""
            className="block object-cover h-full w-full absolute"
            loading="lazy"
            onLoad={() => {
              setLoading(false);
            }}
          />
        </div>
      </AspectRatio>
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white bg-opacity-40 backdrop-blur-md flex items-center gap-2">
        <h3 className="text-xl font-bold text-center">{album.title}</h3>
        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
        <p className="text-sm font-light">
          {dayjs(album.date).format("MMMM YYYY")}
        </p>
      </div>
    </Card>
  );
}

export default AlbumThumbnail;

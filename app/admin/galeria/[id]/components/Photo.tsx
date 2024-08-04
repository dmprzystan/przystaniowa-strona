import { AlbumPhoto } from "@/app/lib/prisma";
import React from "react";

function Photo({ photo }: { photo: AlbumPhoto }) {
  return (
    <div>
      <img
        src={`/galeria/img/${photo.url}`}
        alt={photo.url}
        className={`w-full h-full object-cover rounded-lg`}
        key={photo.id}
      />
    </div>
  );
}

export default Photo;

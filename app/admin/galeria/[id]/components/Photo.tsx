import { AlbumPhoto, AlbumPhotoSize } from "@/app/lib/prisma";
import React, { useEffect } from "react";
import { motion } from "framer-motion";

import {
  DeleteRounded,
  StarBorderRounded,
  StarRounded,
} from "@mui/icons-material";

function Photo({
  photo,
  handleDelete,
  handleStar,
  fetchAll,
}: {
  photo: AlbumPhoto;
  handleDelete: (id: string) => void;
  handleStar: (id: string) => void;
  fetchAll: () => void;
}) {
  const [hover, setHover] = React.useState(false);
  const [size, setSize] = React.useState<AlbumPhotoSize>(photo.size);
  const [isStarred, setIsStarred] = React.useState(
    photo.thumbnailForAlbumId !== null
  );

  useEffect(() => {
    setSize(photo.size);
    setIsStarred(photo.thumbnailForAlbumId !== null);
  }, [photo]);

  const handleSize = async (size: AlbumPhotoSize) => {
    setSize(size);

    const res = await fetch(`/api/admin/gallery/${photo.albumId}/${photo.id}`, {
      method: "PUT",
      body: JSON.stringify({ size }),
    });

    if (!res.ok) {
      fetchAll();
    }
  };

  return (
    <motion.div
      className={`relative ${size.toLowerCase()}`}
      key={photo.id}
      onTouchStart={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "BUTTON") return;
        setHover((prev) => !prev);
      }}
      onHoverStart={() => {
        setHover(true);
      }}
      onHoverEnd={() => {
        setHover(false);
      }}
    >
      <img
        src={`/galeria/img/${photo.url}`}
        alt={photo.url}
        className={`w-full h-full object-cover rounded-lg`}
        key={photo.id}
      />
      {hover && (
        <div className="absolute left-0 top-0 w-full h-full px-3 py-2 flex gap-2">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-2">
              <button
                className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md rounded-full shadow-none hover:shadow-lg hover:bg-opacity-40 transition-all"
                onMouseDown={() => {
                  handleSize("NORMAL");
                }}
              >
                <div
                  className={`pointer-events-none h-2 w-2 ${
                    size === "NORMAL" ? "bg-yellow-500" : "bg-white"
                  } rounded-sm`}
                />
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md rounded-full shadow-none hover:shadow-lg hover:bg-opacity-40 transition-all"
                onMouseDown={() => {
                  handleSize("WIDE");
                }}
              >
                <div
                  className={`pointer-events-none h-2 w-4 ${
                    size === "WIDE" ? "bg-yellow-500" : "bg-white"
                  } rounded-sm`}
                />
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md rounded-full shadow-none hover:shadow-lg hover:bg-opacity-40 transition-all"
                onMouseDown={() => {
                  handleSize("TALL");
                }}
              >
                <div
                  className={`pointer-events-none h-4 w-2 ${
                    size === "TALL" ? "bg-yellow-500" : "bg-white"
                  } rounded-sm`}
                />
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md rounded-full shadow-none hover:shadow-lg hover:bg-opacity-40 transition-all"
                onMouseDown={(e) => {
                  handleSize("BIG");
                }}
              >
                <div
                  className={`pointer-events-none h-4 w-4 ${
                    size === "BIG" ? "bg-yellow-500" : "bg-white"
                  } rounded-sm`}
                />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md rounded-full shadow-none hover:shadow-lg hover:bg-opacity-40 transition-all"
                onClick={() => {
                  handleStar(photo.id);
                  setIsStarred(true);
                }}
                disabled={isStarred}
              >
                <div className="pointer-events-none flex items-center justify-center">
                  {isStarred ? (
                    <StarRounded
                      className="text-yellow-500"
                      style={{ fontSize: 20 }}
                    />
                  ) : (
                    <StarBorderRounded
                      className="text-white"
                      style={{ fontSize: 20 }}
                    />
                  )}
                </div>
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-full shadow-none hover:shadow-lg hover:bg-red-600 transition-all"
                onClick={() => {
                  handleDelete(photo.id);
                }}
              >
                <DeleteRounded
                  className="text-white pointer-events-none"
                  style={{ fontSize: 20 }}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Photo;

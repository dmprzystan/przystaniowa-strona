import { AlbumPhoto, AlbumPhotoSize } from "@/app/lib/prisma";
import React, { useEffect } from "react";
import { motion } from "framer-motion";

import { DeleteRounded } from "@mui/icons-material";

function Photo({
  photo,
  handleDelete,
  fetchAll,
}: {
  photo: AlbumPhoto;
  handleDelete: (id: string) => void;
  fetchAll: () => void;
}) {
  const [hover, setHover] = React.useState(false);
  const [size, setSize] = React.useState<AlbumPhotoSize>(photo.size);

  useEffect(() => {
    setSize(photo.size);
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
                onClick={() => {
                  handleSize("NORMAL");
                }}
              >
                <div className="h-2 w-2 bg-white rounded-sm"></div>
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md rounded-full shadow-none hover:shadow-lg hover:bg-opacity-40 transition-all"
                onClick={() => {
                  handleSize("WIDE");
                }}
              >
                <div className="h-2 w-4 bg-white rounded-sm"></div>
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md rounded-full shadow-none hover:shadow-lg hover:bg-opacity-40 transition-all"
                onClick={() => {
                  handleSize("TALL");
                }}
              >
                <div className="h-4 w-2 bg-white rounded-sm"></div>
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md rounded-full shadow-none hover:shadow-lg hover:bg-opacity-40 transition-all"
                onClick={() => {
                  handleSize("BIG");
                }}
              >
                <div className="h-4 w-4 bg-white rounded-sm"></div>
              </button>
            </div>
            <button
              className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-full"
              onClick={() => {
                handleDelete(photo.id);
              }}
            >
              <DeleteRounded className="text-white" style={{ fontSize: 20 }} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Photo;

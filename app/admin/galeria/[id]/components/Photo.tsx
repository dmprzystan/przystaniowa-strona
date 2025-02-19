import { AlbumPhoto, AlbumPhotoSize } from "@/app/lib/prisma";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  DeleteRounded,
  StarBorderRounded,
  StarRounded,
} from "@mui/icons-material";

function Photo({
  photo,
  refresh,
}: {
  photo: AlbumPhoto;
  refresh: () => Promise<void>;
}) {
  const [hover, setHover] = useState(false);

  const handleSize = async (size: AlbumPhotoSize) => {
    await fetch(`/api/admin/gallery/${photo.albumId}/${photo.id}`, {
      method: "PUT",
      body: JSON.stringify({ size }),
    });

    await refresh();
  };

  const handleStar = async (id: string) => {
    await fetch(`/api/admin/gallery/${photo.albumId}/${id}/thumbnail`, {
      method: "PUT",
    });

    refresh();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/gallery/${photo.albumId}/${id}`, {
      method: "DELETE",
    });

    refresh();
  };

  return (
    <motion.div
      className={`relative ${photo.size.toLowerCase()}`}
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
        src={`/public/${photo.url}`}
        alt={photo.url}
        className={`w-full h-full object-cover rounded-lg`}
        key={photo.id}
        loading="lazy"
      />
      {hover && (
        <div className="absolute left-0 top-0 w-full h-full px-3 py-2 flex gap-2">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-2">
              <SizeButton photo={photo} handleSize={handleSize} size="NORMAL" />
              <SizeButton photo={photo} handleSize={handleSize} size="WIDE" />
              <SizeButton photo={photo} handleSize={handleSize} size="TALL" />
              <SizeButton photo={photo} handleSize={handleSize} size="BIG" />
            </div>
            <div className="flex gap-2">
              <StarButton photo={photo} handleStar={handleStar} />
              <DeleteButton photo={photo} handleDelete={handleDelete} />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function DeleteButton({
  photo,
  handleDelete,
}: {
  photo: AlbumPhoto;
  handleDelete: (id: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-full shadow-none hover:shadow-lg hover:bg-red-600 transition-all"
      onClick={async () => {
        setLoading(true);
        await handleDelete(photo.id);
        setLoading(false);
      }}
      disabled={loading}
    >
      {loading ? (
        <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
      ) : (
        <DeleteRounded
          className="text-white pointer-events-none"
          style={{ fontSize: 20 }}
        />
      )}
    </button>
  );
}

function SizeButton({
  photo,
  size,
  handleSize,
}: {
  photo: AlbumPhoto;
  size: AlbumPhotoSize;
  handleSize: (size: AlbumPhotoSize) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const getClassName = (size: AlbumPhotoSize) => {
    switch (size) {
      case "NORMAL":
        return "h-2 w-2";
      case "WIDE":
        return "h-2 w-4";
      case "TALL":
        return "h-4 w-2";
      case "BIG":
        return "h-4 w-4";
    }
  };

  return (
    <button
      className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md rounded-full shadow-none hover:shadow-lg hover:bg-opacity-40 transition-all"
      onMouseDown={async () => {
        setLoading(true);
        await handleSize(size);
        setLoading(false);
      }}
      disabled={photo.size === size || loading}
    >
      {loading ? (
        <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
      ) : (
        <div
          className={`pointer-events-none ${getClassName(size)} ${
            photo.size === size ? "bg-yellow-500" : "bg-white"
          } rounded-sm`}
        />
      )}
    </button>
  );
}

function StarButton({
  photo,
  handleStar,
}: {
  photo: AlbumPhoto;
  handleStar: (id: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md rounded-full shadow-none hover:shadow-lg hover:bg-opacity-40 transition-all"
      onClick={async () => {
        setLoading(true);
        await handleStar(photo.id);
        setLoading(false);
      }}
      disabled={loading}
    >
      {loading ? (
        <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
      ) : (
        <>
          {photo.thumbnailForAlbumId !== null ? (
            <StarRounded className="text-yellow-500" style={{ fontSize: 20 }} />
          ) : (
            <StarBorderRounded
              className="text-white"
              style={{ fontSize: 20 }}
            />
          )}
        </>
      )}
    </button>
  );
}

export default Photo;

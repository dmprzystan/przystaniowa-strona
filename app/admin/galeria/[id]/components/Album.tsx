"use client";

import React from "react";
import type { Album } from "@/app/lib/prisma";

import {
  CloudUploadRounded,
  EditRounded,
  ImageNotSupportedRounded,
} from "@mui/icons-material";
import Upload from "./Upload";
import "@/app/galeria/style.scss";
import Photo from "./Photo";

type AlbumProps = {
  album: Album;
};

function Album(props: AlbumProps) {
  const [album, setAlbum] = React.useState<Album>(props.album);
  const [upload, setUpload] = React.useState(false);
  const [edit, setEdit] = React.useState(false);

  const handleDelete = async (id: string) => {
    fetch(`/api/admin/gallery/${album.id}/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        getAlbum();
      }
    });
    setAlbum((prev) => ({
      ...prev,
      AlbumPhoto: prev.AlbumPhoto.filter((photo) => photo.id !== id),
    }));
  };

  const getAlbum = async () => {
    const res = await fetch(`/api/admin/gallery/${album.id}`);
    const rawData = (await res.json()) as { album: Album };

    const data: Album = {
      ...rawData.album,
      date: new Date(rawData.album.date),
    };

    setAlbum(data);
  };

  return (
    <>
      <div className="px-4 sm:px-16 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl text-center font-semibold">{album.title}</h2>
          <div className="flex gap-4">
            <button
              className="bg-blue-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all flex gap-2 items-center"
              onClick={() => {
                setEdit(true);
              }}
            >
              <EditRounded />
              Edytuj
            </button>
            <button
              className="bg-gray-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all flex gap-2 items-center"
              onClick={() => {
                setUpload(true);
              }}
            >
              <CloudUploadRounded />
              Dodaj zdjęcie
            </button>
          </div>
        </div>
        {album.AlbumPhoto.length > 0 ? (
          <div className="mt-8 masonry">
            {album.AlbumPhoto.map((photo, i) => (
              <Photo
                key={photo.id}
                photo={photo}
                handleDelete={handleDelete}
                fetchAll={getAlbum}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <ImageNotSupportedRounded style={{ fontSize: 100 }} />
            <h3 className="flex flex-col gap-2 items-center font-bold text-3xl">
              Brak zdjęć w albumie.
              <span className="font-extralight text-base">
                Kliknij przycisk{" "}
                <span className="font-semibold">Dodaj zdjęcie</span> aby dodać
                zdjęcie do albumu.
              </span>
            </h3>
          </div>
        )}
      </div>
      {upload && (
        <Upload
          album={album}
          onClose={() => setUpload(false)}
          onSubmit={getAlbum}
        />
      )}
    </>
  );
}

export default Album;

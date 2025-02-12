"use client";

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

import NewAlbum from "./components/NewAlbum";

import type { Album } from "@/app/lib/prisma";
import { toast } from "sonner";
import Link from "next/link";
import { ImageNotSupportedRounded } from "@mui/icons-material";

export default function Page() {
  const [gallery, setGallery] = useState<Album[]>([]);
  const [cachedNumber, setCachedNumber] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cache = window.localStorage.getItem("cached-gallery");
    setCachedNumber(parseInt(cache ?? "0"));

    fetchGallery().then(() => setLoading(false));
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();

      const parsedData = data
        .map((album: Album) => ({
          ...album,
          date: new Date(album.date),
        }))
        .sort((a: Album, b: Album) => b.date.valueOf() - a.date.valueOf());

      setGallery(parsedData);

      window.localStorage.setItem(
        "cached-gallery",
        parsedData.length.toString()
      );
    } catch (error) {
      toast.error("Nie udało się pobrać galerii");
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-16 w-full mt-4">
        <div className="flex justify-center md:justify-between items-center">
          <h2 className="text-4xl text-center">Galeria</h2>
          <NewAlbum refresh={fetchGallery} />
        </div>
        <div className="gallery grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 mt-8 md:mt-16">
          {gallery.map((album) => (
            <Link
              key={album.id}
              className="flex flex-col gap-4 px-2 py-2 hover:shadow-arround duration-300 transition-all rounded-3xl overflow-hidden justify-end"
              href={`/admin/galeria/${album.id}`}
            >
              <div className="w-full h-full rounded-3xl overflow-hidden">
                {album.thumbnail ? (
                  <img
                    src={`/galeria/img/${album.thumbnail.url}`}
                    alt=""
                    className="block rounded-3xl object-cover shadow-xl h-full w-full"
                  />
                ) : album.photos.length === 0 ? (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center flex-col gap-2">
                    <ImageNotSupportedRounded className="text-gray-500" />
                    <p className="text-lg text-gray-500">Brak zdjęć</p>
                  </div>
                ) : (
                  <img
                    src={`/galeria/img/${album.photos[0].url}`}
                    alt=""
                    className="block rounded-3xl object-cover shadow-xl h-full w-full"
                  />
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-3xl font-extrabold text-center uppercase whitespace-nowrap text-ellipsis w-full overflow-hidden">
                  {album.title}
                </h3>
                <p className="text-xl">
                  <span className="font-bold">month</span>
                  <span> </span>
                  <span className="font-light">{album.date.getFullYear()}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";

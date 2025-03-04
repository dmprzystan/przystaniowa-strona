"use client";

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

import NewAlbum from "./components/NewAlbum";

import type { Album } from "@/app/lib/prisma";
import { toast } from "sonner";
import Link from "next/link";
import { ImageNotSupportedRounded } from "@mui/icons-material";
import { Card } from "@/components/ui/card";

import "@/app/galeria/style.scss";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import dayjs from "dayjs";
import "dayjs/locale/pl";
import { Skeleton } from "@/components/ui/skeleton";

dayjs.locale("pl");

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
          {loading ? (
            <>
              {Array.from({ length: cachedNumber }).map((_, i) => (
                <SkeletonAlbum key={i} />
              ))}
            </>
          ) : (
            <>
              {gallery.map((album) => (
                <AlbumThumbnail album={album} key={album.id} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function SkeletonAlbum() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const random = Math.floor(Math.random() * 8) + 8;

    const randomString = Array.from({ length: random })
      .map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
      .join("");

    setTitle(randomString);

    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomYear = Math.floor(Math.random() * 15) + 2010;

    const randomDate = new Date(randomYear, randomMonth, 1);

    setDate(dayjs(randomDate).format("MMMM YYYY"));
  }, []);

  return (
    <Card className="h-full w-full relative overflow-hidden">
      <AspectRatio ratio={4 / 3}>
        <Skeleton className="w-full h-full" />
      </AspectRatio>
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white bg-opacity-40 backdrop-blur-md flex items-center gap-2">
        <Skeleton className="text-xl font-bold text-center px-2 text-transparent">
          {title}
        </Skeleton>
        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
        <Skeleton className="text-sm font-light text-transparent">
          {date}
        </Skeleton>
      </div>
    </Card>
  );
}

function AlbumThumbnail({ album }: { album: Album }) {
  return (
    <Link
      key={album.id}
      className="col-span-1"
      href={`/admin/galeria/${album.id}`}
    >
      <Card className="h-full w-full relative overflow-hidden hover:shadow-arround transition-all duration-200">
        <AspectRatio ratio={4 / 3}>
          {album.thumbnail || album.photos.length > 0 ? (
            <img
              src={`/public/${
                album.thumbnail ? album.thumbnail.url : album.photos[0].url
              }`}
              alt=""
              className="block object-cover h-full w-full"
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center flex-col gap-2">
              <ImageNotSupportedRounded className="text-gray-500" />
              <p className="text-lg text-gray-500">Brak zdjęć</p>
            </div>
          )}
        </AspectRatio>
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white bg-opacity-40 backdrop-blur-md flex items-center gap-2">
          <h3 className="text-xl font-bold text-center">{album.title}</h3>
          <div className="w-1 h-1 bg-muted-foreground rounded-full" />
          <p className="text-sm font-light">
            {dayjs(album.date).format("MMMM YYYY")}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export const dynamic = "force-dynamic";

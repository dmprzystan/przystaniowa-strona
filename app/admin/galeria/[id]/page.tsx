"use client";

import Navbar from "@/app/admin/components/Navbar";
import { Album } from "@/app/lib/prisma";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import dayjs from "dayjs";
import "dayjs/locale/pl";
import { Separator } from "@/components/ui/separator";
import DeleteDialog from "./components/DeleteDialog";
import EditDialog from "./components/EditDialog";
import UploadDialog from "./components/UploadDialog";
dayjs.locale("pl");

import "@/app/galeria/style.scss";
import Photo from "./components/Photo";

export default function Page({ params }: { params: { id: string } }) {
  const [album, setAlbum] = useState<Album>();
  const [loading, setLoading] = useState(true);

  const [placeholderData, setPlaceholderData] = useState({
    title: "",
    date: new Date(),
    description: "",
  });

  const router = useRouter();

  const createRandomData = () => {
    const random = Math.floor(Math.random() * 8) + 8;
    const randomMultiplier = Math.floor(Math.random() * 5) + 1; // For the description
    const randomString = Array.from({ length: random })
      .map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
      .join("");

    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomYear = Math.floor(Math.random() * 15) + 2010;

    const randomDate = new Date(randomYear, randomMonth, 1);

    setPlaceholderData({
      title: randomString,
      date: randomDate,
      description: Array.from({ length: randomMultiplier })
        .map(() => randomString)
        .join(" "),
    });
  };

  useEffect(() => {
    createRandomData();
    fetchAlbum().then(() => setLoading(false));
  }, []);

  const fetchAlbum = async () => {
    try {
      const res = await fetch(`/api/admin/gallery/${params.id}`);
      const data = await res.json();

      const parsedData: Album = {
        ...data,
        date: new Date(data.date),
      };

      parsedData.photos = parsedData.photos.toSorted(
        (a, b) =>
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
      );

      const thumbnailIndex = parsedData.photos.findIndex(
        (photo) => photo.thumbnailForAlbumId !== null
      );

      if (thumbnailIndex > 0) {
        const thumbnail = parsedData.photos.splice(thumbnailIndex, 1)[0];

        parsedData.photos.unshift(thumbnail);
      }

      console.log(parsedData.photos);

      if (!parsedData) {
        router.push("/admin/galeria");
      }

      setAlbum(parsedData);
    } catch (error) {
      router.push("/admin/galeria");
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-16 w-full mt-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-4 items-center ml-10 sm:ml-0 overflow-hidden">
            <Breadcrumb className="flex-grow">
              <BreadcrumbList className="gap-1 flex-nowrap">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/admin/galeria">Galeria</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="flex w-0 flex-grow">
                  {loading ? (
                    <Skeleton className="min-w-12 py-2 text-transparent overflow-hidden text-ellipsis whitespace-nowrap">
                      {placeholderData.title}
                    </Skeleton>
                  ) : (
                    <BreadcrumbPage className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {album?.title}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex gap-2 flex-shrink-0">
              {loading ? (
                <>
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </>
              ) : (
                <>
                  <UploadDialog album={album!} refresh={fetchAlbum} />
                  <EditDialog album={album!} refresh={fetchAlbum} />
                  <DeleteDialog album={album} />
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center md:justify-between items-center">
            {loading ? (
              <Skeleton className="min-w-16 text-4xl py-2 text-transparent">
                {placeholderData.title}
              </Skeleton>
            ) : (
              <h2 className="text-4xl text-center">{album?.title}</h2>
            )}
            {loading ? (
              <Skeleton className="text-base py-2 text-transparent">
                {dayjs(placeholderData.date).format("MMMM YYYY")}
              </Skeleton>
            ) : (
              <p className="font-light text-base md:text-lg flex-shrink-0">
                {dayjs(album?.date).format("MMMM YYYY")}
              </p>
            )}
          </div>
          {(album?.description || loading) && <Separator />}
          <div>
            {loading ? (
              <Skeleton className="py-4 text-transparent">
                {placeholderData.description}
              </Skeleton>
            ) : (
              <p>{album?.description}</p>
            )}
          </div>
        </div>
        <div className="mt-8 masonry grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 px-4">
          {album?.photos.map((photo) => (
            <Photo key={photo.id} photo={photo} refresh={fetchAlbum} />
          ))}
        </div>
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";

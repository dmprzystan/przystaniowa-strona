"use client";

import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import NewTrip from "./components/NewTrip";

import { Trip } from "@/app/lib/prisma";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type RawTrip = {
  id: string;
  title: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  thumbnail: string;
  TripAttachment: { url: string; name: string }[];
  TripLink: { url: string; name: string }[];
};

export default function Page() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [cachedNumber, setCachedNumber] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cache = window.localStorage.getItem("cached-trips");
    setCachedNumber(parseInt(cache ?? "0"));
    fetchTrips().then(() => setLoading(false));
  }, []);

  async function fetchTrips() {
    try {
      const response = await fetch("/api/admin/trips");
      const data = (await response.json()) as RawTrip[];

      const parsedData = data
        .map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          dateStart: new Date(item.dateStart),
          dateEnd: new Date(item.dateEnd),
          thumbnail: item.thumbnail,
          TripAttachment: item.TripAttachment,
          TripLink: item.TripLink,
        }))
        .sort((a, b) => b.dateStart.valueOf() - a.dateStart.valueOf());

      setTrips(parsedData);
      window.localStorage.setItem("cached-trips", parsedData.length.toString());
    } catch (error) {
      toast.error("Błąd podczas pobierania wyjazdów");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-16 w-full mt-4">
        <div className="flex justify-center md:justify-between items-center">
          <h2 className="text-4xl text-center">Wyjazdy</h2>
          <NewTrip />
        </div>
        <div className="flex flex-col gap-4 mt-8">
          {loading ? (
            <>
              {Array.from({ length: cachedNumber }).map((_, i) => (
                <Card
                  className="flex flex-row h-32 lg:h-56 p-2 lg:p-4 gap-2 lg:gap-4"
                  key={i}
                >
                  <div
                    className="flex-shrink-0 h-full flex items-center justify-center object-fill overflow-hidden rounded-lg shadow-sm"
                    style={{
                      aspectRatio: "4 / 3",
                    }}
                  >
                    <Skeleton className="w-full h-full" />
                  </div>
                  <Separator orientation="vertical" className="h-full" />
                  <div className="overflow-hidden flex flex-col h-full gap-2 flex-1">
                    <CardTitle className="flex-shrink-0 text-lg lg:text-xl xl:text-3xl overflow-hidden whitespace-nowrap text-ellipsis">
                      <Skeleton className="w-full text-transparent">
                        asdf
                      </Skeleton>
                    </CardTitle>
                    <Skeleton className="flex-1" />
                    <div className="flex flex-row text-xs lg:text-sm gap-4">
                      <Skeleton className="text-transparent">
                        Załączniki: 0
                      </Skeleton>
                      <Skeleton className="text-transparent">Linki: 0</Skeleton>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          ) : (
            <>
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link key={trip.id} href={`/admin/wyjazdy/${trip.id}`}>
      <Card className="flex flex-row h-32 lg:h-56 p-2 lg:p-4 gap-2 lg:gap-4">
        {trip.thumbnail && (
          <>
            <div
              className="flex-shrink-0 h-full flex items-center justify-center object-fill overflow-hidden rounded-lg shadow-sm"
              style={{
                aspectRatio: "4 / 3",
              }}
            >
              <Image
                src={`/public/${trip.thumbnail}`}
                alt=""
                width={320}
                height={240}
                className="w-full h-full object-cover"
              />
            </div>
            <Separator orientation="vertical" className="h-full" />
          </>
        )}
        <div className="overflow-hidden flex flex-col h-full">
          <CardTitle className="flex-shrink-0 text-lg lg:text-xl xl:text-3xl overflow-hidden whitespace-nowrap text-ellipsis">
            {trip.title}
          </CardTitle>
          <div
            className="text-xs lg:text-sm xl:text-base flex-1 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: trip.description }}
          />
          <div className="flex flex-row text-xs lg:text-sm gap-3">
            <p>
              Załączniki: <span>{trip.TripAttachment.length}</span>
            </p>
            <p>
              Linki: <span>{trip.TripLink.length}</span>
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

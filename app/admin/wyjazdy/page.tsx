"use client";

import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import NewTrip from "./components/NewTrip";

import { Trip } from "@/app/lib/prisma";
import { toast } from "sonner";

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
      </div>
    </>
  );
}

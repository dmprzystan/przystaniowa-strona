"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import { Newspaper } from "@/app/lib/prisma";
import NewNewspaper from "./components/NewNewspaper";
import GazetkaItem from "./components/GazetkaItem";

import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const [newspapers, setNewspapers] = useState<Newspaper[]>([]);
  const [cachedNumber, setCachedNumber] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cache = window.localStorage.getItem("cached-newspapers");
    setCachedNumber(parseInt(cache ?? "0"));

    fetchNewspapers().then(() => setLoading(false));
  }, []);

  async function fetchNewspapers() {
    try {
      const response = await fetch("/api/admin/newspaper");
      const data = (await response.json()) as {
        id: string;
        title: string;
        date: string;
        url: string;
      }[];

      const parsedData = data
        .map((item) => ({
          id: item.id,
          title: item.title,
          date: new Date(item.date),
          url: item.url,
        }))
        .sort((a, b) => b.date.valueOf() - a.date.valueOf());

      setNewspapers(parsedData);
      window.localStorage.setItem(
        "cached-newspapers",
        parsedData.length.toString()
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-16 w-full mt-4">
        <div className="flex justify-center md:justify-between items-center">
          <h2 className="text-3xl sm:text-4xl text-center">GAZETKA 19tka</h2>
          <NewNewspaper
            lastNumber={parseInt(newspapers[0]?.title) ?? 0}
            update={fetchNewspapers}
          />
        </div>
        <div className="flex flex-col mt-8 gap-8">
          {loading ? (
            <>
              {Array.from({ length: cachedNumber }).map((_, i) => (
                <Skeleton className="h-16" key={i} />
              ))}
            </>
          ) : (
            <>
              {newspapers.map((newspaper) => (
                <GazetkaItem
                  newspaper={newspaper}
                  key={newspaper.id}
                  update={fetchNewspapers}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";

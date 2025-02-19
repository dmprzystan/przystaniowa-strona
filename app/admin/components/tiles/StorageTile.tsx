"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const MAX_SPACE = 10 * 1024 * 1024 * 1024; // 10GB

function StorageTile() {
  const [usedSpace, setUsedSpace] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsedSpace().then((space) => {
      setUsedSpace(space);
      setLoading(false);
    });
  });

  const fetchUsedSpace = async () => {
    const response = await fetch("/api/admin");
    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych");
    }

    const data = await response.json();
    return parseInt(data.storage);
  };

  // Calculate the percentage of used space rounded to 2 decimal places
  const getUsedPercentage = (space: number) => {
    return Math.round((space / MAX_SPACE) * 10000) / 100;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Wykorzystane miejsce</CardTitle>
        <CardDescription>
          Ilość miejsca na pliki, które możesz przechowywać na serwerze.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="w-full h-10" />
        ) : (
          <>
            <div className="flex gap-2 items-center">
              <Progress value={getUsedPercentage(usedSpace)} />
              <span className="text-sm">{getUsedPercentage(usedSpace)}%</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {formatBytes(usedSpace)} z {formatBytes(MAX_SPACE)} wykorzystane
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default StorageTile;

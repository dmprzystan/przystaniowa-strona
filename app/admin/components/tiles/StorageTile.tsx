"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function StorageTile() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Wykorzystane miejsce</CardTitle>
        <CardDescription>
          Ilość miejsca na pliki, które możesz przechowywać na serwerze.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 items-center">
          <Progress value={50} />
          <span className="text-sm">50%</span>
        </div>
        <div>
          <p className="text-sm text-gray-500">5GB z 10GB wykorzystane</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default StorageTile;

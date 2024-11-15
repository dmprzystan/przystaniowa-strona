"use client";

import type { Trip } from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { TrashIcon } from "@radix-ui/react-icons";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function Wyjazd(props: { trip: Trip }) {
  const [trip, setTrip] = useState<Trip>(props.trip);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const deleteTrip = async (id: string) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/trips/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete trip");
      }

      router.replace("/admin/wyjazdy");
      return;
    } catch (e) {
      toast.error("Nie udało się usunąć wyjazdu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="px-4 sm:px-16 w-full mt-4">
        <div className="flex justify-center items-center">
          <h2 className="text-2xl md:text-4xl text-center font-semibold">
            {trip.title}
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" className="absolute right-4">
                <TrashIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-4/5 rounded-lg pt-10">
              <DialogHeader>
                <DialogTitle>
                  Czy na pewno chcesz usunąć ten wyjazd?
                </DialogTitle>
                <DialogDescription>
                  Usunięcie wyjazdu jest{" "}
                  <span className="font-semibold">nieodwracalne</span>.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex flex-row justify-between">
                <DialogClose asChild>
                  <Button variant="outline" size="lg">
                    Anuluj
                  </Button>
                </DialogClose>
                <Button
                  size="lg"
                  onClick={() => {
                    deleteTrip(trip.id);
                  }}
                  disabled={loading}
                >
                  {loading && (
                    <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
                  )}
                  Usuń
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default Wyjazd;

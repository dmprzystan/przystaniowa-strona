"use client";

import type { Trip } from "@/app/lib/prisma";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  BookmarkIcon,
  CalendarIcon,
  Pencil2Icon,
  TrashIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import Editor from "./Editor";

type UnparsedTrip = {
  id: string;
  title: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  TripPhoto: { url: string }[];
  TripAttachment: { url: string; name: string }[];
  TripLink: { url: string; name: string }[];
};

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

  const updateTrip = async (id: string, data: Partial<Trip>) => {
    try {
      const res = await fetch(`/api/admin/trips/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const trip = (await res.json()) as UnparsedTrip;
      setTrip(parseTrip(trip));
      toast.success("Zaktualizowano wyjazd");
    } catch (e: any) {
      if (e.message) {
        toast.error(e.message);
      } else {
        toast.error("Nie udało się zaktualizować wyjazdu");
      }

      const res = await fetch(`/api/admin/trips/${id}`);
      const trip = (await res.json()) as UnparsedTrip;
      setTrip(parseTrip(trip));
    }
  };

  const fetchTrip = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/trips/${id}`);

      if (!res.ok) {
        throw new Error("Failed to fetch trip");
      }

      const trip = (await res.json()) as UnparsedTrip;
      setTrip(parseTrip(trip));
    } catch (e) {
      toast.error("Nie udało się pobrać wyjazdu");
    }
  };

  function parseTrip(trip: UnparsedTrip): Trip {
    return {
      ...trip,
      dateStart: new Date(trip.dateStart),
      dateEnd: new Date(trip.dateEnd),
    };
  }

  return (
    <>
      <div className="px-4 sm:px-16 w-full mt-4">
        <div className="flex justify-center items-center">
          <h2 className="text-2xl md:text-4xl text-center font-semibold max-w-[260px] overflow-hidden text-ellipsis whitespace-nowrap">
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
        <div className="flex flex-col mt-8 gap-4">
          <TitleEdit trip={trip} updateTrip={updateTrip} />
          <DateEdit trip={trip} updateTrip={updateTrip} />
          <ImageEdit trip={trip} fetchTrip={fetchTrip} />
          <DescriptionEdit trip={trip} updateTrip={updateTrip} />
        </div>
      </div>
    </>
  );
}

interface PartialEditProps {
  trip: Trip;
  updateTrip: (id: string, data: Partial<Trip>) => Promise<void>;
}

interface IndependentEditProps {
  trip: Trip;
  fetchTrip: (id: string) => Promise<void>;
}

function TitleEdit({ trip, updateTrip }: PartialEditProps) {
  const [title, setTitle] = useState(trip.title);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setTitle(trip.title);
  }, [trip]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-end justify-between w-full">
        <p className="text-secondary-foreground font-light">Tytuł</p>
        {edit ? (
          <Button
            size="icon"
            onClick={async () => {
              setLoading(true);
              await updateTrip(trip.id, { title });
              setLoading(false);
              setEdit(false);
            }}
            disabled={loading}
          >
            {loading ? (
              <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
            ) : (
              <BookmarkIcon />
            )}
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={() => {
              setEdit(true);
            }}
          >
            <Pencil2Icon />
          </Button>
        )}
      </div>
      {edit ? (
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tytuł"
          disabled={loading}
          className="text-xl"
        />
      ) : (
        <h2 className="text-2xl mt-0">{title}</h2>
      )}
    </div>
  );
}

function DateEdit({ trip, updateTrip }: PartialEditProps) {
  const [date, setDate] = useState<DateRange>({
    from: trip.dateStart,
    to: trip.dateEnd,
  });
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setDate({
      from: trip.dateStart,
      to: trip.dateEnd,
    });
  }, [trip]);

  if (isDesktop) {
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-end justify-between w-full">
        <p className="text-secondary-foreground font-light">Data</p>
        {edit ? (
          <Button
            size="icon"
            onClick={async () => {
              setLoading(true);
              await updateTrip(trip.id, {
                dateStart: date.from,
                dateEnd: date.to,
              });
              setLoading(false);
              setEdit(false);
            }}
            disabled={loading}
          >
            {loading ? (
              <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
            ) : (
              <BookmarkIcon />
            )}
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={() => {
              setEdit(true);
            }}
          >
            <Pencil2Icon />
          </Button>
        )}
      </div>
      {edit ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="px-3 gap-1 w-full justify-start"
            >
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {dayjs(date.from).locale("pl").format("DD MMMM YYYY")} -{" "}
                {dayjs(date.to).locale("pl").format("DD MMMM YYYY")}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-fit rounded-2xl">
            <Calendar
              mode="range"
              defaultMonth={date.from}
              selected={date}
              onSelect={(date) => date && setDate(date)}
              numberOfMonths={1}
              initialFocus
            />
          </DialogContent>
        </Dialog>
      ) : (
        <div className="flex py-2 items-center px-3 gap-1 w-full justify-start">
          <CalendarIcon className="mr-1 h-4 w-4" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {dayjs(date.from).locale("pl").format("DD MMMM YYYY")} -{" "}
            {dayjs(date.to).locale("pl").format("DD MMMM YYYY")}
          </span>
        </div>
      )}
    </div>
  );
}

function ImageEdit({ trip, fetchTrip }: IndependentEditProps) {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (trip.TripPhoto[0]?.url) {
      fetch(`/wyjazdy/${trip.id}/${trip.TripPhoto[0].url}`)
        .then((res) => {
          if (res.ok) {
            return res.blob();
          }
        })
        .then((blob) => {
          if (!blob) return;
          const file = new File([blob], trip.TripPhoto[0].url);
          setFile(file);
        });
    }
  }, [trip]);

  const handleImageUpdate = async (): Promise<void> => {
    setLoading(true);
    try {
      if (!file) {
        // Delete the image
        const res = await fetch(`/api/admin/trips/${trip.id}/image`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete image");
        }
      } else {
        if (!changed) return;

        const res = await fetch(`/api/admin/trips/${trip.id}/image`, {
          method: "POST",
          body: JSON.stringify({ photoExt: file.name.split(".").pop() }),
        });

        if (!res.ok) {
          throw new Error("Failed to update image");
        }

        const { par } = await res.json();

        const upload = await fetch(par, {
          method: "PUT",
          body: file,
        });

        if (!upload.ok) {
          throw new Error("Failed to upload image");
        }
      }

      toast.success("Zaktualizowano zdjęcie");
    } catch (e) {
      toast.error("Nie udało się zaktualizować zdjęcia");
    } finally {
      await fetchTrip(trip.id);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-end justify-between w-full">
        <p className="text-secondary-foreground font-light">Zdjęcie</p>
        {edit ? (
          <Button
            size="icon"
            onClick={async () => {
              setLoading(true);
              await handleImageUpdate();
              setLoading(false);
              setEdit(false);
            }}
            disabled={loading}
          >
            {loading ? (
              <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
            ) : (
              <BookmarkIcon />
            )}
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={() => {
              setEdit(true);
            }}
          >
            <Pencil2Icon />
          </Button>
        )}
      </div>
      <AspectRatio ratio={4 / 3}>
        {edit ? (
          <label
            className={`block h-full rounded-xl overflow-hidden relative ${
              file && file.size > 0 && "pointer-events-none"
            }`}
          >
            <input
              type="file"
              id="image-input"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setChanged(true);
                  setFile(e.target.files[0]);
                }
              }}
            />
            {file && file.size > 0 ? (
              <>
                <img src={URL.createObjectURL(file)} alt="Zdjęcie" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 backdrop-blur-sm">
                  <label
                    htmlFor="image-input"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 w-9 pointer-events-auto"
                  >
                    <UploadIcon />
                  </label>
                  <Button
                    size="icon"
                    className="pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setFile(null);
                    }}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-neutral-100 border-2 border-neutral-400 rounded-xl border-dashed">
                <div className="hidden sm:flex"></div>
                <div className="sm:hidden flex flex-col items-center gap-2">
                  Kliknij, aby wybrać zdjęcie
                  <div className="bg-primary text-primary-foreground p-1 rounded-md">
                    <UploadIcon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )}
          </label>
        ) : (
          <div className="h-full rounded-xl overflow-hidden">
            {trip.TripPhoto[0]?.url ? (
              <img
                src={`/wyjazdy/${trip.id}/${trip.TripPhoto[0].url}`}
                alt="Zdjęcie"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="bg-white flex items-center justify-center w-full h-full">
                <p>Brak zdjęcia</p>
              </div>
            )}
          </div>
        )}
      </AspectRatio>
    </div>
  );
}

function DescriptionEdit({ trip, updateTrip }: PartialEditProps) {
  const [description, setDescription] = useState(trip.description);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setDescription(trip.description);
  }, [trip]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-end justify-between w-full">
        <p className="text-secondary-foreground font-light">Opis</p>
        {edit ? (
          <Button
            size="icon"
            onClick={async () => {
              setLoading(true);
              await updateTrip(trip.id, { description });
              setLoading(false);
              setEdit(false);
            }}
            disabled={loading}
          >
            {loading ? (
              <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
            ) : (
              <BookmarkIcon />
            )}
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={() => {
              setEdit(true);
            }}
          >
            <Pencil2Icon />
          </Button>
        )}
      </div>
      {edit ? (
        <Editor value={description} setValue={setDescription} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: description }} />
      )}
    </div>
  );
}

export default Wyjazd;

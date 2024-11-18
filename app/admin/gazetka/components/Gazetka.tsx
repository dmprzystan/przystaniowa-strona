"use client";

import { useEffect, useState } from "react";
import { Newspaper } from "@/app/lib/prisma";
import GazetkaItem from "./GazetkaItem";
import LoadingButton from "../../components/LoadingButton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UploadIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import { toast } from "sonner";

type GazetkaProps = {
  newspapers: Newspaper[];
};

const APILink = "/api/admin/newspaper";

function Gazetka(props: GazetkaProps) {
  const [clientNewspapers, setClientNewspapers] = useState(props.newspapers);

  const handleDelete = async (id: string) => {
    setClientNewspapers((prev) => prev.filter((item) => item.id !== id));

    await fetch(`${APILink}/${id}`, {
      method: "DELETE",
    });

    getNewspapers();
  };

  const handleEdit = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    setClientNewspapers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title: data.get("title") as string,
            date: new Date(data.get("date") as string),
          };
        }
        return item;
      })
    );

    await fetch(`${APILink}/${id}`, {
      method: "PUT",
      body: data,
    });

    getNewspapers();
  };

  const getNewspapers = async () => {
    const res = await fetch(APILink);
    const data = (await res.json()) as {
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

    setClientNewspapers(parsedData);
  };

  const update = async () => {
    const res = await fetch(APILink);
    const data = (await res.json()) as {
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

    setClientNewspapers(parsedData);
  };

  return (
    <>
      <div className="px-4 sm:px-16 w-full mt-4">
        <div className="flex justify-center md:justify-between items-center">
          <h2 className="text-4xl text-center">GAZETKA 19tka</h2>
          <NewNewspaper
            lastNumber={parseInt(clientNewspapers[0]?.title) ?? 0}
            update={update}
          />
        </div>
        <div className="flex flex-col mt-8 gap-8">
          {clientNewspapers.map((newspaper) => (
            <GazetkaItem
              newspaper={newspaper}
              key={newspaper.id}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const NewNewspaperSchema = z.object({
  number: z.coerce.number(),
  date: z.coerce.date(),
  file: z.instanceof(File).refine((file) => file.name.endsWith(".pdf")),
});

type NewNewspaperProps = {
  lastNumber: number;
  update: () => Promise<void>;
};

function NewNewspaper({ lastNumber, update }: NewNewspaperProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm<z.infer<typeof NewNewspaperSchema>>({
    resolver: zodResolver(NewNewspaperSchema),
    defaultValues: {
      number: lastNumber + 1,
      date: new Date(),
      // @ts-ignore
      file: null,
    },
  });

  useEffect(() => {
    if (open) {
      form.setValue("number", lastNumber + 1);
    } else {
      form.reset();
    }
  }, [open]);

  useEffect(() => {}, [open]);

  async function handleSubmit(data: z.infer<typeof NewNewspaperSchema>) {
    setLoading(true);

    try {
      const res = await fetch(APILink, {
        method: "POST",
        body: JSON.stringify({
          title: data.number,
          date: data.date,
        }),
      });

      if (!res.ok) {
        throw new Error("Błąd podczas dodawania gazetki");
      }

      const { par, id } = await res.json();

      const uploadRes = await fetch(par, {
        method: "PUT",
        body: data.file,
      });

      if (!uploadRes.ok) {
        await fetch(`${APILink}/${id}`, {
          method: "DELETE",
        });

        throw new Error("Błąd podczas dodawania pliku, cofnięto dodawanie");
      }

      setOpen(false);
      toast.success("Pomyślnie dodano gazetkę");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      await update();
      form.reset();
      setLoading(false);
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon">
            <UploadIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj gazetkę</DialogTitle>
            <DialogDescription>Dodaj nową gazetkę do listy</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col items-stretch gap-4"
            >
              <div className="flex gap-4 justify-between">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Numer</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Numer"
                          required
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.number?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dayjs(form.getValues("date")).format(
                                "DD MMMM YYYY"
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={form.getValues("date")}
                              onSelect={(date) =>
                                form.setValue("date", date ?? new Date())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.date?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Plik</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="application/pdf"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.file?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <DialogFooter className="flex !justify-between">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Anuluj
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading && (
                    <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
                  )}
                  Dodaj
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} repositionInputs={false}>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="absolute right-2 md:relative md:right-auto"
        >
          <UploadIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Dodaj gazetkę</DrawerTitle>
          <DrawerDescription>Dodaj nową gazetkę do listy</DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col items-stretch gap-4 px-4"
          >
            <div className="flex gap-4 justify-between">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Numer</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Numer"
                        required
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.number?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dayjs(form.getValues("date")).format(
                              "DD MMMM YYYY"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={form.getValues("date")}
                            onSelect={(date) =>
                              form.setValue("date", date ?? new Date())
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.date?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Plik</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="application/pdf"
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.file?.message?.toString()}
                  </FormMessage>
                </FormItem>
              )}
            />
            <DrawerFooter className="flex !justify-between gap-4">
              <DrawerClose asChild>
                <Button type="button" variant="secondary">
                  Anuluj
                </Button>
              </DrawerClose>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
                )}
                Dodaj
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

export default Gazetka;

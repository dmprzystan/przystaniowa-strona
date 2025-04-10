"use client";

import React, { useEffect, useState } from "react";

import Dialog from "@/components/ui/dialog";
import Drawer from "@/components/ui/drawer";
import Popover from "@/components/ui/popover";
import Form from "@/components/ui/form";

import Editor from "./Editor";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";

import dayjs from "dayjs";
import "dayjs/locale/pl";
import { pl } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

dayjs.locale("pl");

const NewTripSchema = z.object({
  title: z.string().min(1, { message: "Tytuł nie może być pusty" }),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date(),
  image: z.instanceof(File),
  description: z.string(),
  attachments: z.array(
    z.object({
      file: z.instanceof(File),
      name: z.string(),
    })
  ),
  links: z.array(
    z.object({
      url: z.string().url(),
      name: z.string(),
    })
  ),
});

function NewTrip() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const Component = isDesktop ? Dialog : Drawer;

  const form = useForm<z.infer<typeof NewTripSchema>>({
    resolver: zodResolver(NewTripSchema),
    defaultValues: {
      title: "",
      dateStart: new Date(),
      dateEnd: new Date(),
      image: new File([], ""),
      description: "",
      attachments: [],
      links: [],
    },
  });

  const handleFormSubmit = async (data: z.infer<typeof NewTripSchema>) => {
    setLoading(true);

    const newTrip = {
      title: data.title,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
      description: data.description,
      image: data.image.name ?? "",
      attachments: data.attachments.map((a) => ({
        name: a.name,
        ext: a.file.name.split(".").pop() ?? "",
      })),
      links: data.links,
    };

    try {
      const res = await fetch("/api/admin/trips", {
        method: "POST",
        body: JSON.stringify(newTrip),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }

      const trip = await res.json();

      const thumbnailRes = await fetch(trip.imagePAR, {
        method: "PUT",
        body: data.image,
      });

      if (!thumbnailRes.ok) {
        throw new Error("Błąd podczas przesyłania zdjęcia");
      }

      const attachmentPromises = data.attachments.map((attachment) => {
        return fetch(
          trip.attachmentPARs.find(
            (a: { name: string; url: string }) => a.name === attachment.name
          )?.url,
          {
            method: "PUT",
            body: attachment.file,
          }
        );
      });

      try {
        await Promise.all(attachmentPromises);
      } catch (e) {
        throw new Error("Błąd podczas przesyłania załączników");
      }

      toast.success("Wyjazd dodany pomyślnie");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);

      form.reset();
      setOpen(false);
    }
  };

  return (
    <Component repositionInputs={false} open={open} onOpenChange={setOpen}>
      <Component.Trigger asChild>
        <Button
          size="icon"
          className="absolute right-2 md:relative md:right-auto"
        >
          <PlusIcon />
        </Button>
      </Component.Trigger>
      <Component.Content className="flex flex-col h-full md:h-auto md:max-h-[80%] md:max-w-2xl rounded-none md:rounded-lg overflow-hidden">
        <ScrollArea className="mt-4 pb-4 flex">
          <Component.Header>
            <Component.Title>Nowy wyjazd</Component.Title>
            <Component.Description>
              Dodaj nowy wyjazd do listy
            </Component.Description>
          </Component.Header>
          <Separator orientation="horizontal" className="mb-4" />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="px-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <Form.Field
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <Form.Item className="flex flex-col w-full">
                        <Form.Label className="ml-2">Tytuł</Form.Label>
                        <Form.Control>
                          <Input
                            {...field}
                            className="text-base"
                            placeholder="Tytuł"
                            required
                          />
                        </Form.Control>
                        <Form.Message>
                          {form.formState.errors.title?.message}
                        </Form.Message>
                      </Form.Item>
                    )}
                  />
                  <div className="flex flex-col max-w-sm">
                    <Form.Label className="ml-2">Data</Form.Label>
                    <DatePicker form={form} />
                  </div>
                </div>
                <Form.Field
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label className="ml-2">Zdjęcie</Form.Label>
                      <ImageInput field={field} />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label className="ml-2">Opis</Form.Label>
                      <Form.Control>
                        <Editor
                          value={field.value}
                          setValue={(value) => field.onChange(value)}
                        />
                      </Form.Control>
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="attachments"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label className="ml-2">Załączniki</Form.Label>
                      <Form.Control>
                        <AttachmentInput field={field} />
                      </Form.Control>
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="links"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label className="ml-2">Linki</Form.Label>
                      <Form.Control>
                        <LinkInput field={field} />
                      </Form.Control>
                    </Form.Item>
                  )}
                />
              </div>
              <Separator orientation="horizontal" className="mt-4" />
              <Component.Footer className="flex-row !justify-between mt-4">
                <Component.Close asChild>
                  <Button variant="outline">Anuluj</Button>
                </Component.Close>
                <Button type="submit" disabled={loading}>
                  {loading && (
                    <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
                  )}
                  Dodaj
                </Button>
              </Component.Footer>
            </form>
          </Form>
        </ScrollArea>
      </Component.Content>
    </Component>
  );
}

function DatePicker({
  form,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof NewTripSchema>>>;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px && hover: none)"); // Test for touch screens, for some reason Popover does not work on iPads
  const [date, setDate] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(),
    to: new Date(),
  });

  const values = form.watch();

  const CalendarComponent = isDesktop ? Popover : Dialog;

  const formatDate = (date: Date) => dayjs(date).format("DD MMMM YYYY");

  useEffect(() => {
    form.setValue("dateStart", date.from);

    if (date.to) {
      form.setValue("dateEnd", date.to);
    } else {
      form.setValue("dateEnd", date.from);
    }
  }, [date]);

  return (
    <CalendarComponent>
      <CalendarComponent.Trigger asChild>
        <Button variant="outline" className="mt-2">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDate(values.dateStart)}
          {formatDate(values.dateStart) !== formatDate(values.dateEnd) && (
            <>
              <span>-</span>
              {formatDate(values.dateEnd)}
            </>
          )}
        </Button>
      </CalendarComponent.Trigger>
      <CalendarComponent.Content className="w-auto rounded-xl">
        <Calendar
          mode="range"
          locale={pl}
          defaultMonth={date.from}
          numberOfMonths={1}
          initialFocus
          selected={{ from: date.from, to: date.to }}
          onSelect={(newDate) => {
            if (!newDate) {
              setDate((date) => ({ from: date.from, to: undefined }));
              return;
            }

            let start = newDate.from;
            let end = newDate.to;

            if (!start || !end) return;

            if (date.to) {
              start = start !== date.from ? start : end;
              end = undefined;

              setDate({ from: start, to: end });
              return;
            }

            if (start > end) {
              [start, end] = [end, start];
            }

            setDate({ from: start, to: end });
          }}
        />
      </CalendarComponent.Content>
    </CalendarComponent>
  );
}

type ImageInputField = ControllerRenderProps<
  z.infer<typeof NewTripSchema>,
  "image"
>;

function ImageInput({ field }: { field: ImageInputField }) {
  return (
    <label
      className="block h-full overflow-hidden"
      htmlFor="image-input"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        field.onChange(e.dataTransfer.files?.[0]);
      }}
    >
      <input
        type="file"
        id="image-input"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          field.onChange(e.target.files?.[0]);
        }}
      />
      {field.value && field.value.size > 0 ? (
        <div className="h-full relative hover:[&>div]:opacity-100 mx-auto max-w-fit rounded-xl overflow-hidden">
          <img
            className="max-h-96"
            src={URL.createObjectURL(field.value)}
            alt="Zdjęcie"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-15 md:bg-opacity-50 md:backdrop-blur-sm md:opacity-0 transition-all duration-300">
            <Button
              size="icon"
              onClick={(e) => {
                field.onChange(new File([], ""));
                e.preventDefault();
                e.stopPropagation();
              }}
              variant="destructive"
            >
              <TrashIcon className="w-8 h-8 text-white" />
            </Button>
          </div>
        </div>
      ) : (
        <AspectRatio ratio={4 / 3}>
          <div className="flex items-center justify-center w-full h-full bg-neutral-100 border-2 border-neutral-400 rounded-xl border-dashed">
            <div className="hidden sm:flex items-center justify-center">
              <div className="flex flex-col items-center">
                <p className="font-semibold">Przeciągnij zdjęcie tutaj</p>
                <p className="font-light text-sm mt-1">lub</p>
                <p>kliknij, aby wybrać</p>
              </div>
            </div>
            <div className="sm:hidden flex flex-col items-center gap-2">
              Kliknij, aby wybrać zdjęcie
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <UploadIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </AspectRatio>
      )}
    </label>
  );
}

type LinkInputField = ControllerRenderProps<
  z.infer<typeof NewTripSchema>,
  "links"
>;

type Link = {
  url: string;
  name: string;
};

const LinkInput = ({ field }: { field: LinkInputField }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleAddLink = () => {
    if (!url || !title) {
      toast.error("Wypełnij wszystkie pola");
      return;
    }

    if (field.value.some((l) => l.name === title)) {
      toast.error("Link o takiej nazwie już istnieje");
      return;
    }

    field.onChange([
      ...field.value,
      {
        name: title,
        url: url,
      },
    ]);
    setOpen(false);
  };

  const cancelAddLink = () => {
    setTitle("");
    setUrl("");
    setOpen(false);
  };

  const handleDeleteLink = (index: number) => {
    field.onChange(field.value.filter((_, i) => i !== index));
  };

  return (
    <ScrollArea className="max-h-48 md:max-h-full">
      <div className="flex flex-col gap-2">
        {field.value.map((link, i: number) => (
          <Card
            key={`${link.name}-${link.url}`}
            className="flex flex-row justify-between w-full overflow-hidden"
          >
            <CardHeader className="p-3 py-4 flex-shrink min-w-0">
              <CardTitle className="text-sm font-bold">{link.name}</CardTitle>
              <CardDescription className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                {link.url}
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-3 py-4">
              <Button
                size="icon"
                type="button"
                onClick={() => handleDeleteLink(i)}
              >
                <TrashIcon />
              </Button>
            </CardFooter>
          </Card>
        ))}
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button variant="default">Dodaj link</Button>
          </Dialog.Trigger>
          <Dialog.Content className="w-4/5 rounded-md">
            <Dialog.Header>
              <Dialog.Title>Dodaj link</Dialog.Title>
              <Dialog.Description>Dodaj link do wyjazdu</Dialog.Description>
            </Dialog.Header>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base !mt-0.5"
              placeholder="Tytuł"
              required
            />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="text-base !mt-2"
              placeholder="https://adres.pl"
              type="url"
              required
            />
            <Dialog.Footer className="flex-row justify-between mt-4">
              <Dialog.Close asChild>
                <Button variant="outline" onClick={cancelAddLink}>
                  Anuluj
                </Button>
              </Dialog.Close>
              <Button variant="default" onClick={handleAddLink}>
                Dodaj
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>
    </ScrollArea>
  );
};

type AttachmentInputField = ControllerRenderProps<
  z.infer<typeof NewTripSchema>,
  "attachments"
>;

type Attachment = {
  file: File;
  name: string;
};

const AttachmentInput = ({ field }: { field: AttachmentInputField }) => {
  const [open, setOpen] = useState(false);
  const [attachment, setAttachment] = useState<Attachment>({
    file: new File([], ""),
    name: "",
  });

  const handleAddAttachment = () => {
    if (attachment.file.name === "") {
      toast.error("Nie wybrano pliku");
      return;
    }

    if (field.value.some((a) => a.name === attachment.name)) {
      toast.error("Załącznik o takiej nazwie już istnieje");
      return;
    }

    field.onChange([...field.value, attachment]);
    setOpen(false);
  };

  const cancelAddAttachment = () => {
    setAttachment({
      file: new File([], ""),
      name: "",
    });
    setOpen(false);
  };

  const handleDeleteAttachment = (index: number) => {
    field.onChange(field.value.filter((_, i) => i !== index));
  };

  const calculateFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  return (
    <ScrollArea className="max-h-48 md:max-h-full">
      <div className="flex flex-col gap-2">
        {field.value.map((attachment, i: number) => (
          <Card
            key={`${attachment.name}-${i}`}
            className="flex flex-row justify-between w-full overflow-hidden"
          >
            <CardHeader className="p-3 py-4 flex-shrink min-w-0">
              <CardTitle className="text-sm font-bold">
                {attachment.name}
              </CardTitle>
              <CardDescription className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                {attachment.name}.{attachment.file.name.split(".").pop()} (
                {calculateFileSize(attachment.file.size)})
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-3 py-4">
              <Button
                size="icon"
                type="button"
                onClick={() => handleDeleteAttachment(i)}
              >
                <TrashIcon />
              </Button>
            </CardFooter>
          </Card>
        ))}
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button variant="default">Dodaj załącznik</Button>
          </Dialog.Trigger>
          <Dialog.Content className="w-4/5 rounded-md">
            <Dialog.Header>
              <Dialog.Title>Dodaj załącznik</Dialog.Title>
              <Dialog.Description>
                Dodaj załącznik do wyjazdu
              </Dialog.Description>
            </Dialog.Header>
            <Input
              value={attachment.name}
              onChange={(e) =>
                setAttachment({ ...attachment, name: e.target.value })
              }
              className="text-base !mt-0.5"
              placeholder="Tytuł"
              required
            />
            <Input
              className="text-base !mt-2"
              type="file"
              onChange={(e) => {
                if (attachment.name === "") {
                  const name = e.target.files?.[0].name
                    .split(".")
                    .slice(0, -1)
                    .join(".");

                  setAttachment((attachment) => ({
                    ...attachment,
                    name: name ?? "",
                  }));
                }

                setAttachment((attachment) => ({
                  ...attachment,
                  file: e.target.files?.[0] ?? new File([], ""),
                }));
              }}
              required
            />
            <Dialog.Footer className="flex-row justify-between mt-4">
              <Dialog.Close asChild>
                <Button variant="outline" onClick={cancelAddAttachment}>
                  Anuluj
                </Button>
              </Dialog.Close>
              <Button variant="default" onClick={handleAddAttachment}>
                Dodaj
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>
    </ScrollArea>
  );
};

export default NewTrip;

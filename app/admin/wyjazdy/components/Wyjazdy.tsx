"use client";

import { Trip } from "@/app/lib/prisma";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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
import {
  CalendarIcon,
  CaretLeftIcon,
  CaretRightIcon,
  FontBoldIcon,
  FontItalicIcon,
  PlusIcon,
  StrikethroughIcon,
  TrashIcon,
  UnderlineIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
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
import { ControllerRenderProps, useForm } from "react-hook-form";
import { date, z } from "zod";
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
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

import dayjs from "dayjs";
import "dayjs/locale/pl";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Editor as IEditor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UndoRounded,
  RedoRounded,
  FormatListBulletedRounded,
  FormatListNumberedRounded,
  FormatIndentDecreaseRounded,
  FormatIndentIncreaseRounded,
} from "@mui/icons-material";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

type Attachment = {
  file: File;
  name: string;
};

type Link = {
  url: string;
  name: string;
};

function Wyjazdy(props: { trips: Trip[] }) {
  const [trips, setTrips] = useState<Trip[]>(props.trips);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const res = await fetch("/api/admin/trips");

    if (!res.ok) {
      toast.error("Wystąpił błąd podczas pobierania wyjazdów");
      return;
    }

    try {
      const data = (await res.json()) as {
        id: string;
        title: string;
        description: string;
        dateStart: string;
        dateEnd: string;
        TripPhoto: { url: string }[];
        TripAttachment: { url: string; name: string }[];
        TripLink: { url: string; name: string }[];
      }[];

      const parsedTrips = data.map((trip) => {
        return {
          id: trip.id,
          title: trip.title,
          description: trip.description,
          dateStart: new Date(trip.dateStart),
          dateEnd: new Date(trip.dateEnd),
          TripPhoto: trip.TripPhoto || [],
          TripAttachment: trip.TripAttachment || [],
          TripLink: trip.TripLink || [],
        };
      });

      setTrips(parsedTrips);
    } catch (e) {
      toast.error("Wystąpił błąd podczas przetwarzania danych");
      return;
    }
  };

  return (
    <>
      <div className="px-4 sm:px-16 w-full mt-4">
        <div className="flex justify-center md:justify-between items-center">
          <h2 className="text-4xl text-center">Wyjazdy</h2>
          <NewTrip update={fetchTrips} />
        </div>
        <div className="flex flex-col gap-4 mt-8">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/admin/wyjazdy/${trip.id}`}>
              <Card className="flex flex-row h-32 lg:h-56 p-2 lg:p-4 gap-2 lg:gap-4">
                {trip.TripPhoto[0]?.url && (
                  <div
                    className="flex-shrink-0 h-full flex items-center justify-center object-fill overflow-hidden rounded-lg shadow-sm"
                    style={{
                      aspectRatio: "4 / 3",
                    }}
                  >
                    <Image
                      src={`/wyjazdy/${trip.id}/${trip.TripPhoto[0].url}`}
                      alt=""
                      width={320}
                      height={240}
                    />
                  </div>
                )}
                <Separator orientation="vertical" className="h-full" />
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
          ))}
        </div>
      </div>
    </>
  );
}

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

function NewTrip({ update }: { update: () => Promise<void> }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [isOpen, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon">
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl w-full max-h-[80%] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Dodaj wyjazd</DialogTitle>
            <DialogDescription>Dodaj nowy wyjazd do listy</DialogDescription>
          </DialogHeader>
          <Separator orientation="horizontal" className="mb-4" />
          <NewTripForm update={update} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer repositionInputs={false} open={isOpen} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="absolute right-2 md:relative md:right-auto"
        >
          <PlusIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col gap-2 items-stretch max-h-full rounded-none">
        <div className="overflow-y-scroll pb-8">
          <DrawerHeader>
            <DrawerTitle>Dodaj wyjazd</DrawerTitle>
            <DrawerDescription>Dodaj nowy wyjazd do listy</DrawerDescription>
          </DrawerHeader>
          <Separator orientation="horizontal" className="mb-4" />
          <div className="px-4">
            <NewTripForm update={update} setOpen={setOpen} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function NewTripForm({
  update,
  setOpen,
}: {
  update: () => Promise<void>;
  setOpen: (open: boolean) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [loading, setLoading] = useState(false);

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

    const newPostData = {
      title: data.title,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
      description: data.description,
      photoExt: data.image.name.split(".").pop(),
      attachments: data.attachments.map((attachment) => ({
        name: attachment.name,
        ext: attachment.file.name.split(".").pop(),
      })),
      links: data.links,
    };

    try {
      const res = await fetch("/api/admin/trips", {
        method: "POST",
        body: JSON.stringify(newPostData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const trip = (await res.json()) as {
        message: string;
        id: string;
        photoPar: string;
        attachmentPAR: string;
      };

      const promises = [];

      promises.push(
        fetch(trip.photoPar, {
          method: "PUT",
          body: data.image,
        })
      );

      data.attachments.forEach((attachment) => {
        const name = `${attachment.name}.${attachment.file.name
          .split(".")
          .pop()}`;

        promises.push(
          fetch(`${trip.attachmentPAR}${name}`, {
            method: "PUT",
            body: new File([attachment.file], name),
          })
        );
      });

      await Promise.all(promises);
      await update();

      toast.success("Wyjazd został dodany");
      form.reset();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);

      setOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="ml-2">Tytuł</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-base"
                      placeholder="Tytuł"
                      required
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.title?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <div className="flex flex-col max-w-sm">
              <FormLabel className="ml-2">Data</FormLabel>
              <CalendarInput form={form} />
            </div>
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-2">Zdjęcie</FormLabel>
                <ImageInput field={field} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-2">Opis</FormLabel>
                <FormControl>
                  <Editor
                    value={field.value}
                    setValue={(value) => field.onChange(value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="attachments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-2">Załączniki</FormLabel>
                <FormControl>
                  <AttachmentInput field={field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="links"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-2">Linki</FormLabel>
                <FormControl>
                  <LinkInput field={field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Separator orientation="horizontal" className="mt-4" />
        {isDesktop ? (
          <DialogFooter className="flex-row !justify-between mt-4">
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading && (
                <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
              )}
              Dodaj
            </Button>
          </DialogFooter>
        ) : (
          <DrawerFooter className="flex !flex-row px-0 justify-between gap-8">
            <DrawerClose asChild>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                className="w-full"
              >
                Anuluj
              </Button>
            </DrawerClose>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading && (
                <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
              )}
              Dodaj
            </Button>
          </DrawerFooter>
        )}
      </form>
    </Form>
  );
}

function CalendarInput({
  form,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof NewTripSchema>>>;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  useEffect(() => {
    if (date.from) {
      form.setValue("dateStart", date.from);
    }
    if (date.to) {
      form.setValue("dateEnd", date.to);
    }
  }, [date]);

  if (isDesktop) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="mt-2">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dayjs(date.from).locale("pl").format("DD MMMM YYYY")}
            <span className="mx-2">-</span>
            {dayjs(date.to).locale("pl").format("DD MMMM YYYY")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            defaultMonth={date.from}
            selected={date}
            onSelect={(date) => date && setDate(date)}
            numberOfMonths={1}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="px-3 gap-1 w-full justify-start">
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
  );
}

type ImageInputField = ControllerRenderProps<
  z.infer<typeof NewTripSchema>,
  "image"
>;

function ImageInput({ field }: { field: ImageInputField }) {
  return (
    <AspectRatio ratio={4 / 3}>
      <label
        className="block h-full rounded-xl overflow-hidden"
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
          <div className="h-full relative hover:[&>div]:opacity-100">
            <img src={URL.createObjectURL(field.value)} alt="Zdjęcie" />
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
        )}
      </label>
    </AspectRatio>
  );
}

function Editor({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
    editorProps: {
      handleClick: () => {
        console.log("TFTF");
      },
      attributes: {
        class:
          "prose p-4 h-full max-h-[48vh] rounded-lg overflow-y-scroll bg-neutral-100 border-neutral-200 border focus:outline-none max-w-none",
      },
    },
  });

  return (
    <EditorContent
      editor={editor}
      className={`relative ${
        (editor?.isFocused || focused) && "pt-16"
      } transition-all`}
      id="editor"
    >
      {editor && (editor.isFocused || focused) && (
        <EditorSidebar editor={editor} setFocused={setFocused} />
      )}
    </EditorContent>
  );
}

const EditorSidebar = ({
  editor,
  setFocused,
}: {
  editor: IEditor;
  setFocused: (focused: boolean) => void;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [step, setStep] = useState(0);
  const [focusTimeout, setFocusTimeout] = useState<Timer | null>(null);

  const [cardFocused, setCardFocused] = useState(false);
  const [selectFocused, setSelectFocused] = useState(false);

  useEffect(() => {
    if (cardFocused || selectFocused) {
      setFocused(true);
    } else {
      setFocused(false);
    }
  }, [cardFocused, selectFocused]);

  if (isDesktop) {
    return (
      <Card
        className="absolute h-12 z-50 left-1/2 -translate-x-1/2 flex items-center px-2 top-2 gap-2 justify-between"
        onTouchStart={() => {
          setCardFocused(true);

          if (focusTimeout) {
            clearTimeout(focusTimeout);
          }

          setFocusTimeout(
            setTimeout(() => {
              setCardFocused(false);
              setFocusTimeout(null);
            }, 500)
          );
        }}
        onMouseDown={(e) => {
          setCardFocused(true);

          if (focusTimeout) {
            clearTimeout(focusTimeout);
          }

          setFocusTimeout(
            setTimeout(() => {
              setCardFocused(false);
              setFocusTimeout(null);
            }, 500)
          );
        }}
      >
        <div className="border rounded-lg flex">
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().undo().run();
            }}
            variant="ghost"
            className={`hover:bg-transparent hover:text-primary`}
          >
            <UndoRounded />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().redo().run();
            }}
            variant="ghost"
            className={`hover:bg-transparent hover:text-primary`}
          >
            <RedoRounded />
          </Button>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="border rounded-lg flex">
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().toggleBold().run();
            }}
            variant="ghost"
            className={`
              hover:bg-transparent
              hover:text-primary
              ${
                editor?.isActive("bold")
                  ? "!bg-primary !text-primary-foreground"
                  : "!bg-transparent !text-secondary-foreground"
              } transition-all duration-300
              ${editor?.isActive("italic") && "rounded-r-none"}`}
          >
            <FontBoldIcon />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().toggleItalic().run();
            }}
            variant="ghost"
            className={`
              hover:bg-transparent
              hover:text-primary
              ${
                editor?.isActive("italic")
                  ? "!bg-primary !text-primary-foreground"
                  : "!bg-transparent !text-secondary-foreground"
              } transition-all duration-300
              ${editor?.isActive("bold") && "rounded-l-none"}
              ${editor?.isActive("underline") && "rounded-r-none"}
              `}
          >
            <FontItalicIcon />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().toggleUnderline().run();
            }}
            variant="ghost"
            className={`
              hover:bg-transparent
              hover:text-primary
              ${
                editor?.isActive("underline")
                  ? "!bg-primary !text-primary-foreground"
                  : "!bg-transparent !text-secondary-foreground"
              } transition-all duration-300
              ${editor?.isActive("italic") && "rounded-l-none"}
              ${editor?.isActive("strike") && "rounded-r-none"}
              `}
          >
            <UnderlineIcon />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().toggleStrike().run();
            }}
            variant="ghost"
            className={`
              hover:bg-transparent
              hover:text-primary
              ${
                editor?.isActive("strike")
                  ? "!bg-primary !text-primary-foreground"
                  : "!bg-transparent !text-secondary-foreground"
              } transition-all duration-300
              ${editor?.isActive("underline") && "rounded-l-none"}
              `}
          >
            <StrikethroughIcon />
          </Button>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="border rounded-lg flex">
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().toggleBulletList().run();
            }}
            variant="ghost"
            className={`
              hover:bg-transparent
              hover:text-primary
              ${
                editor?.isActive("bulletList")
                  ? "!bg-primary !text-primary-foreground"
                  : "!bg-transparent !text-secondary-foreground"
              } transition-all duration-300
              ${editor?.isActive("orderedList") && "rounded-r-none"}
              `}
          >
            <FormatListBulletedRounded />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().toggleOrderedList().run();
            }}
            variant="ghost"
            className={`
              hover:bg-transparent
              hover:text-primary
              ${
                editor?.isActive("orderedList")
                  ? "!bg-primary !text-primary-foreground"
                  : "!bg-transparent !text-secondary-foreground"
              } transition-all duration-300
              ${editor?.isActive("bulletList") && "rounded-l-none"}
              `}
          >
            <FormatListNumberedRounded />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().liftListItem("listItem").run();
            }}
            variant="ghost"
            className={`
              hover:bg-transparent hover:text-primary transition-all duration-300`}
          >
            <FormatIndentDecreaseRounded />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              editor?.chain().focus().sinkListItem("listItem").run();
            }}
            variant="ghost"
            className={`
              hover:bg-transparent hover:text-primary transition-all duration-300`}
          >
            <FormatIndentIncreaseRounded />
          </Button>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <Select
          onOpenChange={(open) => {
            if (open) {
              setSelectFocused(true);
            } else {
              setTimeout(() => {
                setSelectFocused(false);
              }, 500);
            }
          }}
          onValueChange={(value) => {
            switch (value) {
              case "h2":
                editor?.chain().focus().setHeading({ level: 2 }).run();
                break;
              case "h3":
                editor?.chain().focus().setHeading({ level: 3 }).run();
                break;
              case "h4":
                editor?.chain().focus().setHeading({ level: 4 }).run();
                break;
              case "p":
                editor?.chain().focus().setParagraph().run();
                break;
              default:
                break;
            }

            setTimeout(() => {
              editor?.chain().focus();
            }, 100);
          }}
          value={
            editor?.isActive("heading", { level: 2 })
              ? "h2"
              : editor?.isActive("heading", { level: 3 })
              ? "h3"
              : editor?.isActive("heading", { level: 4 })
              ? "h4"
              : "p"
          }
        >
          <SelectTrigger className="overflow-hidden">
            <SelectValue className="w-full overflow-hidden text-ellipsis whitespace-nowrap" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="h2">Nagłówek 1</SelectItem>
            <SelectItem value="h3">Nagłówek 2</SelectItem>
            <SelectItem value="h4">Nagłówek 3</SelectItem>
            <SelectItem value="p">Paragraf</SelectItem>
          </SelectContent>
        </Select>
      </Card>
    );
  }

  return (
    <Card
      className="max-w-md absolute h-12 z-50 left-1/2 -translate-x-1/2 flex items-center px-2 top-2 gap-2 justify-between"
      onTouchStart={() => {
        setCardFocused(true);

        if (focusTimeout) {
          clearTimeout(focusTimeout);
        }

        setFocusTimeout(
          setTimeout(() => {
            setCardFocused(false);
            setFocusTimeout(null);
          }, 500)
        );
      }}
    >
      {step === 0 && (
        <>
          <div className="border rounded-lg flex">
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().undo().run();
              }}
              variant="ghost"
              className={`hover:bg-transparent hover:text-primary`}
            >
              <UndoRounded />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().redo().run();
              }}
              variant="ghost"
              className={`hover:bg-transparent hover:text-primary`}
            >
              <RedoRounded />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="border rounded-lg flex">
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().toggleBold().run();
              }}
              variant="ghost"
              className={`
              hover:bg-transparent
              hover:text-primary
              ${
                editor?.isActive("bold")
                  ? "!bg-primary !text-primary-foreground"
                  : "!bg-transparent !text-secondary-foreground"
              } transition-all duration-300
              ${editor?.isActive("italic") && "rounded-r-none"}`}
            >
              <FontBoldIcon />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().toggleItalic().run();
              }}
              variant="ghost"
              className={`
              hover:bg-transparent
              hover:text-primary
              ${
                editor?.isActive("italic")
                  ? "!bg-primary !text-primary-foreground"
                  : "!bg-transparent !text-secondary-foreground"
              } transition-all duration-300
              ${editor?.isActive("bold") && "rounded-l-none"}
              ${editor?.isActive("underline") && "rounded-r-none"}
              `}
            >
              <FontItalicIcon />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().toggleUnderline().run();
              }}
              variant="ghost"
              className={`
              hover:bg-transparent
              hover:text-primary
              ${
                editor?.isActive("underline")
                  ? "!bg-primary !text-primary-foreground"
                  : "!bg-transparent !text-secondary-foreground"
              } transition-all duration-300
              ${editor?.isActive("italic") && "rounded-l-none"}
              ${editor?.isActive("strike") && "rounded-r-none"}
              `}
            >
              <UnderlineIcon />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().toggleStrike().run();
              }}
              variant="ghost"
              className={`
              hover:bg-transparent
              hover:text-primary
              ${
                editor?.isActive("strike")
                  ? "!bg-primary !text-primary-foreground"
                  : "!bg-transparent !text-secondary-foreground"
              } transition-all duration-300
              ${editor?.isActive("underline") && "rounded-l-none"}
              `}
            >
              <StrikethroughIcon />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="border rounded-lg flex">
            <Button
              size="icon"
              onClick={() => {
                setStep(1);
                editor.chain().focus();
              }}
              variant="ghost"
              className={`hover:bg-transparent hover:text-primary`}
            >
              <CaretRightIcon />
            </Button>
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <div className="border rounded-lg flex">
            <Button
              size="icon"
              onClick={() => {
                setStep(0);
                editor.chain().focus();
              }}
              variant="ghost"
              className={`hover:bg-transparent hover:text-primary`}
            >
              <CaretLeftIcon />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="border rounded-lg flex">
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().toggleBulletList().run();
              }}
              variant="ghost"
              className={`
              hover:bg-transparent
              hover:text-primary
              ${
                editor?.isActive("bulletList")
                  ? "!bg-primary !text-primary-foreground"
                  : "!bg-transparent !text-secondary-foreground"
              } transition-all duration-300
              ${editor?.isActive("orderedList") && "rounded-r-none"}
              `}
            >
              <FormatListBulletedRounded />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().toggleOrderedList().run();
              }}
              variant="ghost"
              className={`
              hover:bg-transparent
              hover:text-primary
              ${
                editor?.isActive("orderedList")
                  ? "!bg-primary !text-primary-foreground"
                  : "!bg-transparent !text-secondary-foreground"
              } transition-all duration-300
              ${editor?.isActive("bulletList") && "rounded-l-none"}
              `}
            >
              <FormatListNumberedRounded />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().liftListItem("listItem").run();
              }}
              variant="ghost"
              className={`
              hover:bg-transparent hover:text-primary transition-all duration-300`}
            >
              <FormatIndentDecreaseRounded />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                editor?.chain().focus().sinkListItem("listItem").run();
              }}
              variant="ghost"
              className={`
              hover:bg-transparent hover:text-primary transition-all duration-300`}
            >
              <FormatIndentIncreaseRounded />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <Select
            onOpenChange={(open) => {
              if (open) {
                setSelectFocused(true);
              } else {
                setTimeout(() => {
                  setSelectFocused(false);
                }, 500);
              }
            }}
            onValueChange={(value) => {
              switch (value) {
                case "h2":
                  editor?.chain().focus().setHeading({ level: 2 }).run();
                  break;
                case "h3":
                  editor?.chain().focus().setHeading({ level: 3 }).run();
                  break;
                case "h4":
                  editor?.chain().focus().setHeading({ level: 4 }).run();
                  break;
                case "p":
                  editor?.chain().focus().setParagraph().run();
                  break;
                default:
                  break;
              }

              setTimeout(() => {
                editor?.chain().focus();
              }, 100);
            }}
            value={
              editor?.isActive("heading", { level: 2 })
                ? "h2"
                : editor?.isActive("heading", { level: 3 })
                ? "h3"
                : editor?.isActive("heading", { level: 4 })
                ? "h4"
                : "p"
            }
          >
            <SelectTrigger className="overflow-hidden">
              <SelectValue className="w-full overflow-hidden text-ellipsis whitespace-nowrap" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h2">Nagłówek 1</SelectItem>
              <SelectItem value="h3">Nagłówek 2</SelectItem>
              <SelectItem value="h4">Nagłówek 3</SelectItem>
              <SelectItem value="p">Paragraf</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}
    </Card>
  );
};

type LinkInputField = ControllerRenderProps<
  z.infer<typeof NewTripSchema>,
  "links"
>;

const LinkInput = ({ field }: { field: LinkInputField }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleAddLink = () => {
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
          <DialogTrigger asChild>
            <Button variant="default">Dodaj link</Button>
          </DialogTrigger>
          <DialogContent className="w-4/5 rounded-md">
            <DialogHeader>
              <DialogTitle>Dodaj link</DialogTitle>
              <DialogDescription>Dodaj link do wyjazdu</DialogDescription>
            </DialogHeader>
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
            <DialogFooter className="flex-row justify-between mt-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={cancelAddLink}>
                  Anuluj
                </Button>
              </DialogClose>
              <Button variant="default" onClick={handleAddLink}>
                Dodaj
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
};

type AttachmentInputField = ControllerRenderProps<
  z.infer<typeof NewTripSchema>,
  "attachments"
>;

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
          <DialogTrigger asChild>
            <Button variant="default">Dodaj załącznik</Button>
          </DialogTrigger>
          <DialogContent className="w-4/5 rounded-md">
            <DialogHeader>
              <DialogTitle>Dodaj załącznik</DialogTitle>
              <DialogDescription>Dodaj załącznik do wyjazdu</DialogDescription>
            </DialogHeader>
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
                  console.log(e.target.files?.[0].name);
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
            <DialogFooter className="flex-row justify-between mt-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={cancelAddAttachment}>
                  Anuluj
                </Button>
              </DialogClose>
              <Button variant="default" onClick={handleAddAttachment}>
                Dodaj
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
};

export default Wyjazdy;

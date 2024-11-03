import React, { useEffect, useState } from "react";

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
import {
  Card,
  CardHeader,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookmarkIcon,
  CaretLeftIcon,
  CaretRightIcon,
  Cross2Icon,
  FontBoldIcon,
  FontItalicIcon,
  Pencil1Icon,
  StrikethroughIcon,
  TrashIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ConfirmationLink } from "@/app/lib/prisma";
import { toast } from "sonner";

import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { ScrollArea } from "@/components/ui/scroll-area";

import "@/app/bierzmowanie/style.scss";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  FormatIndentDecrease,
  FormatIndentDecreaseRounded,
  FormatIndentIncreaseRounded,
  FormatListBulletedRounded,
  FormatListNumberedRounded,
  RedoRounded,
  UndoRounded,
} from "@mui/icons-material";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type EditConfirmationProps = {
  confirmation: string;
  update: () => Promise<void>;
};

type EditLinksProps = {
  links: ConfirmationLink[];
  update: () => Promise<void>;
};

const newLinkSchema = z.object({
  title: z.string().min(3, { message: "Tytuł musi mieć przynajmniej 3 znaki" }),
  url: z.string().url("Niepoprawny adres URL"),
});

function EditConfirmation({ confirmation, update }: EditConfirmationProps) {
  const [editConfirmation, setEditConfirmation] = useState(confirmation);

  const [loading, setLoading] = useState(false);
  const [isDiff, setIsDiff] = useState(false);

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setIsDiff(editConfirmation !== confirmation);
  }, [editConfirmation]);

  useEffect(() => {
    setEditConfirmation(confirmation);
    setIsDiff(false);
  }, [confirmation]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/confirmation", {
        method: "PATCH",
        body: JSON.stringify({ confirmation: editConfirmation }),
      });

      if (!res.ok) {
        throw new Error("Wystąpił błąd podczas zapisywania zmian");
      }

      toast.success("Zapisano zmiany");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      await update();
      setLoading(false);
    }
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <div>
        <div className="flex justify-between items-center px-4">
          <h3 className="text-2xl font-semibold transition-all duration-300">
            Opis
          </h3>
          <div>
            {editing ? (
              <div className="flex gap-2">
                <Button size="icon" onClick={() => setEditing(false)}>
                  <Cross2Icon />
                </Button>
                <Button
                  size="icon"
                  disabled={loading || !isDiff}
                  onClick={async () => {
                    await handleSave();
                    setEditing(false);
                  }}
                >
                  {loading ? (
                    <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
                  ) : (
                    <BookmarkIcon />
                  )}
                </Button>
              </div>
            ) : (
              <Button size="icon" onClick={() => setEditing(true)}>
                <Pencil1Icon />
              </Button>
            )}
          </div>
        </div>
        {editing ? (
          <DesktopEditor
            confirmation={editConfirmation}
            updateValue={setEditConfirmation}
          />
        ) : (
          <div
            className="bierzmowanie bg-dimmedBlue p-4 rounded-lg"
            dangerouslySetInnerHTML={{ __html: confirmation }}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center px-4">
        <h3 className="text-2xl font-semibold transition-all duration-300">
          Opis
        </h3>
        <Drawer
          open={editing}
          onOpenChange={setEditing}
          repositionInputs={false}
          dismissible={false}
        >
          <DrawerTrigger asChild>
            <Button size="icon">
              <Pencil1Icon />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-full rounded-none [&>*:first-child]:hidden">
            <div className="max-w-md w-full mx-auto flex flex-col h-full">
              <div className="flex flex-grow h-[48vh] flex-col px-2 gap-4 mt-2">
                <Editor
                  confirmation={editConfirmation}
                  updateValue={setEditConfirmation}
                />
              </div>
              <Separator className="mt-2" />
              <div className="flex-shrink-0 flex-grow flex flex-col">
                <DrawerHeader className="flex-grow">
                  <DrawerTitle className="text-2xl">Edytuj</DrawerTitle>
                  <DrawerDescription className="text-base">
                    Edytuj opis bierzmowania
                  </DrawerDescription>
                </DrawerHeader>
                <Separator className="mt-4 mb-2" />
                <DrawerFooter className="flex flex-col gap-2">
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setEditing(false)}
                    >
                      Anuluj
                    </Button>
                  </DrawerClose>
                  <Button
                    variant="default"
                    disabled={loading || !isDiff}
                    onClick={handleSave}
                    size="lg"
                  >
                    {loading && (
                      <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
                    )}
                    Zapisz
                  </Button>
                </DrawerFooter>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div
        className="mt-4 bierzmowanie bg-dimmedBlue p-4 rounded-lg"
        dangerouslySetInnerHTML={{ __html: confirmation }}
      />
    </>
  );
}

function EditLinks({ links, update }: EditLinksProps) {
  const [editLinks, setEditLinks] = useState(links);

  const [loading, setLoading] = useState(false);
  const [isDiff, setIsDiff] = useState(false);

  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof newLinkSchema>>({
    resolver: zodResolver(newLinkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  useEffect(() => {
    setIsDiff(
      links.some((link) => !editLinks.includes(link)) ||
        editLinks.some((link) => !links.includes(link))
    );
  }, [editLinks]);

  useEffect(() => {
    setEditLinks(links);
  }, [links]);

  const addLink = (data: z.infer<typeof newLinkSchema>) => {
    setEditLinks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: data.title,
        url: data.url,
      },
    ]);

    setOpen(false);
  };

  const removeLink = (id: string) => {
    setEditLinks((prev) => prev.filter((link) => link.id !== id));
  };

  const handleSave = async () => {
    setLoading(true);
    const addedLinks = editLinks.filter(
      (link) => !links.some((l) => l.id === link.id)
    );
    const removedLinks = links.filter(
      (link) => !editLinks.some((l) => l.id === link.id)
    );

    try {
      const add = await Promise.all(
        addedLinks.map((link) =>
          fetch("/api/admin/confirmation/links", {
            method: "POST",
            body: JSON.stringify(link),
          })
        )
      );

      if (add.some((response) => !response.ok)) {
        throw new Error("Wystąpił błąd podczas dodawania linków");
      }

      const remove = await Promise.all(
        removedLinks.map((link) =>
          fetch(`/api/admin/confirmation/links/${link.id}`, {
            method: "DELETE",
          })
        )
      );

      if (remove.some((response) => !response.ok)) {
        throw new Error("Wystąpił błąd podczas usuwania linków");
      }

      toast.success("Zapisano zmiany");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      await update();
      setLoading(false);
    }
  };

  useEffect(() => {
    form.reset();
  }, [open]);

  useEffect(() => {
    setEditLinks(links);
  }, [editing]);

  return (
    <Drawer open={editing} onOpenChange={setEditing} repositionInputs={false}>
      <DrawerTrigger asChild>
        <Button size="icon">
          <Pencil1Icon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-full">
        <div className="max-w-md w-full mx-auto">
          <DrawerHeader>
            <DrawerTitle>Edytuj</DrawerTitle>
            <DrawerDescription>Edytuj linki do bierzmowania</DrawerDescription>
          </DrawerHeader>
          <Separator className="my-4" />
          <div className="flex flex-col px-2 gap-4">
            <ScrollArea className="max-h-48 h-48">
              <div className="flex flex-col gap-4">
                {editLinks.map((link) => (
                  <Card
                    key={link.id}
                    className="flex flex-row justify-between w-full overflow-hidden"
                  >
                    <CardHeader className="p-3 py-4 flex-shrink min-w-0">
                      <CardTitle className="text-sm font-bold">
                        {link.title}
                      </CardTitle>
                      <CardDescription className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        {link.url}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3 py-4">
                      <Button size="icon" onClick={() => removeLink(link.id)}>
                        <TrashIcon />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="default">Dodaj link</Button>
              </DialogTrigger>
              <DialogContent className="w-4/5 rounded-md">
                <DialogHeader>
                  <DialogTitle>Dodaj link</DialogTitle>
                  <DialogDescription>
                    Dodaj link do bierzmowania
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(addLink)}>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              className="text-base !mt-0.5"
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
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              className="text-base !mt-2"
                              placeholder="https://adres.pl"
                              type="url"
                              required
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.title?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="flex-row justify-between mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Anuluj</Button>
                      </DialogClose>
                      <Button variant="default">Dodaj</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <Separator className="mt-4" />
          <DrawerFooter className="flex flex-row justify-between">
            <DrawerClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DrawerClose>
            <Button
              variant="default"
              disabled={loading || !isDiff}
              onClick={handleSave}
            >
              {loading && (
                <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
              )}
              Zapisz
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Editor({
  confirmation,
  updateValue,
}: {
  confirmation: string;
  updateValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [step, setStep] = useState(0);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: confirmation,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      updateValue(editor.getHTML());
    },
    editorProps: {
      attributes: {
        style: "margin-top: 0",
        class:
          "pt-16 pb-4 h-full max-h-[48vh] rounded-lg overflow-y-scroll bg-dimmedBlue bierzmowanie focus:outline-none max-w-none",
      },
    },
  });

  return (
    <>
      {isDesktop ? (
        <EditorContent editor={editor} />
      ) : (
        <>
          <Card className="max-w-md fixed h-12 z-50 left-1/2 -translate-x-1/2 flex items-center px-2 top-4 gap-2 justify-between">
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
          <EditorContent className="h-full overflow-hidden" editor={editor} />
        </>
      )}
    </>
  );
}

function DesktopEditor({
  confirmation,
  updateValue,
}: {
  confirmation: string;
  updateValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: confirmation,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      updateValue(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "py-4 rounded-lg overflow-y-scroll bg-dimmedBlue bierzmowanie focus:outline-none max-w-none",
      },
    },
  });

  return (
    <div className="flex flex-col items-center -mt-10">
      <div className="sticky flex justify-center z-50 top-8">
        <Card className="h-12 flex items-center px-2 gap-2 justify-between">
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
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export { EditConfirmation, EditLinks };

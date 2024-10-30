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
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
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

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditConfirmation(confirmation);
  }, [confirmation]);

  useEffect(() => {
    setIsDiff(confirmation !== editConfirmation);
  }, [editConfirmation]);

  return (
    <Drawer
      repositionInputs={false}
      dismissible={false}
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <Button size="icon">
          <Pencil1Icon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full flex-col px-4 rounded-t-none">
        <div className={`${editing ? "max-h-0" : "max-h-28"} transition-all`}>
          <DrawerHeader>
            <DrawerTitle>Edytuj</DrawerTitle>
            <DrawerDescription>Edytuj treść bierzmowania</DrawerDescription>
          </DrawerHeader>
          <Separator className="my-4" />
        </div>
        <Editor
          confirmation={editConfirmation}
          setConfirmation={setEditConfirmation}
          setEditing={setEditing}
        />
        <div className={`${editing ? "max-h-0" : "max-h-28"} transition-all`}>
          <Separator className="mt-4" />
          <DrawerFooter className="flex flex-row justify-between">
            <DrawerClose asChild>
              <Button onClick={() => setOpen(false)} variant="outline">
                Anuluj
              </Button>
            </DrawerClose>
            <Button
              variant="default"
              disabled={loading || !isDiff}
              // onClick={handleSave}
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
  setConfirmation,
  setEditing,
}: {
  confirmation: string;
  setConfirmation: React.Dispatch<React.SetStateAction<string>>;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isControlVisible, setControlVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: confirmation,
    onUpdate: ({ editor }) => {
      setConfirmation(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "rounded-lg h-full bg-dimmedBlue bierzmowanie focus:outline-none max-w-none",
      },
    },
  });

  const handleResize = () => {
    const height = window.visualViewport?.height || 0;
    const offsetTop = window.visualViewport?.offsetTop || 0;

    // Detect keyboard visibility by comparing viewport height to the initial height
    const keyboardIsVisible = offsetTop > 0 || height < window.innerHeight;

    // setControlVisible(!!(keyboardIsVisible && editor?.isFocused));
    setKeyboardHeight(window.innerHeight - height);
  };

  useEffect(() => {
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, [editor]);

  return (
    <div className="overflow-y-scroll">
      <div
        className={`fixed left-0 right-0 delay-300 duration-200 bg-dimmedBlue z-[100] ${
          isControlVisible ? "h-6" : "delay-0 duration-0 h-0"
        } transition-all`}
        style={{ bottom: `${keyboardHeight}px` }}
      >
        {/* Add your editor controls here */}
        <button onClick={() => {}}>Bold</button>
        <button>Underline</button>
      </div>
      <EditorContent
        className={`${isControlVisible ? "pb-80" : ""}`}
        editor={editor}
        onFocus={() => {
          setTimeout(() => {
            handleResize();
            setControlVisible(true);
          }, 500);
          setTimeout(() => {
            window.scrollTo({
              top: 0,
            });
          }, 100);
          setEditing(true);
        }}
        onBlur={() => {
          setControlVisible(false);
          setEditing(false);
        }}
      />
    </div>
  );
}

export { EditConfirmation, EditLinks };

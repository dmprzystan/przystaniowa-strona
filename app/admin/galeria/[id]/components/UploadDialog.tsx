import React, { useEffect, useRef, useState } from "react";

import Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Album } from "@/app/lib/prisma";
import { CheckIcon, Cross2Icon, UploadIcon } from "@radix-ui/react-icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type UploadDialogProps = {
  album: Album;
  refresh: () => Promise<void>;
};

type Upload = {
  file: File;
};

function UploadDialog({ album, refresh }: UploadDialogProps) {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const uploads = Array.from(files).map((file) => ({
      file,
      progress: 0,
    }));

    setUploads((prev) => [...prev, ...uploads]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeUpload = (upload: Upload) => {
    setUploads((prev) => prev.filter((u) => u !== upload));

    refresh();
  };

  const handleOpenChange = (newState: boolean) => {
    if (newState) {
      setOpen(true);
      return;
    }

    if (uploads.length > 0) {
      toast.error("Zdjęcia są w trakcie wysyłania");
      return;
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button size="icon">
          <UploadIcon />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="max-w-md rounded-xl">
        <Dialog.Header className="px-2">
          <Dialog.Title>Dodaj zdjęcia do albumu</Dialog.Title>
          <Dialog.Description>
            W tym miejscu możesz dodawać zdjęcia do albumu. Możesz dodać dowolną
            ilość zdjęć.
          </Dialog.Description>
        </Dialog.Header>
        <form>
          <AspectRatio ratio={4 / 3}>
            <input
              className="hidden"
              ref={inputRef}
              accept="image/*"
              type="file"
              name="images"
              id="images"
              multiple
              onChange={handleUpload}
            />
            <label
              htmlFor="images"
              className="flex items-center justify-center w-full h-full bg-gray-200 hover:bg-gray-300 transition-all duration-300 cursor-pointer rounded-lg"
            >
              <div className="flex flex-col items-center gap-2">
                <h3 className="font-semibold text-xl">
                  Przeciągnij zdjęcia lub kliknij w obszar
                </h3>
                <p className="text-sm font-medium text-secondary-foreground">
                  Obsługiwane formaty:{" "}
                  <span className="font-normal">
                    JPG, JPEG, PNG, GIF, WEBP, SVG
                  </span>
                </p>
                <p className="text-sm font-light text-secondary-foreground text-center">
                  Zdjęcia zostaną dodane do albumu po skończeniu wysyłania.
                </p>
              </div>
            </label>
          </AspectRatio>
        </form>
        {uploads.length > 0 && (
          <ScrollArea>
            <div className="flex gap-2 mb-2">
              {uploads.map((upload) => (
                <ImageUpload
                  key={upload.file.name}
                  upload={upload}
                  album={album}
                  removeUpload={removeUpload}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-1.5" />
          </ScrollArea>
        )}
      </Dialog.Content>
    </Dialog>
  );
}

type SelfContainedUpload = {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  presignedUrl: string;
};

function ImageUpload({
  upload,
  album,
  removeUpload,
}: {
  upload: Upload;
  album: Album;
  removeUpload: (upload: Upload) => void;
}) {
  const uploadStarted = useRef(false);

  const [selfUpload, setSelfUpload] = useState<SelfContainedUpload | null>(
    null
  );

  useEffect(() => {
    if (!upload.file) return;
    if (uploadStarted.current) return;

    uploadStarted.current = true;

    handleUpload(upload.file);
  }, [upload.file]);

  const getImageDimensions = async (file: File) => {
    return new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
    });
  };

  const handleUpload = async (file: File) => {
    setSelfUpload({
      file,
      progress: 0,
      status: "pending",
      presignedUrl: "",
    });

    const dimensions = await getImageDimensions(file);
    const ar = dimensions.width / dimensions.height;
    const delta = ar - 4 / 3;

    let size = "NORMAL";

    if (delta > 0.25) {
      size = "WIDE";
    } else if (delta < -0.25) {
      size = "TALL";
    }

    if (dimensions.width > 1920 && "NORMAL") {
      size = "BIG";
    }

    const res = await fetch(`/api/admin/gallery/${album.id}`, {
      method: "POST",
      body: JSON.stringify({
        fileName: file.name,
        size,
      }),
    });

    if (!res.ok) {
      setSelfUpload((prev) => (prev ? { ...prev, status: "error" } : null));
      return;
    }

    const data = await res.json();

    const { presignedUrl } = data;

    setSelfUpload((prev) =>
      prev ? { ...prev, status: "uploading", presignedUrl } : null
    );

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presignedUrl, true);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      setSelfUpload((prev) =>
        prev ? { ...prev, progress: (e.loaded / e.total) * 100 } : null
      );
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        setSelfUpload((prev) => (prev ? { ...prev, status: "done" } : null));
      } else {
        setSelfUpload((prev) => (prev ? { ...prev, status: "error" } : null));
      }
    };
    xhr.send(file);
  };

  useEffect(() => {
    if (!selfUpload) return;

    if (selfUpload.status === "done" || selfUpload.status === "error") {
      setTimeout(() => {
        removeUpload(upload);
      }, 2000);
    }
  }, [selfUpload]);

  return (
    <Card
      key={upload.file.name}
      className="overflow-hidden h-24 w-32 relative flex-shrink-0"
    >
      <div className="absolute inset-0 bg-white bg-opacity-30 flex items-center justify-center backdrop-blur-[2px]">
        <div className="flex justify-center items-center gap-2 w-full">
          {selfUpload?.status === "pending" && (
            <div className="border-2 rounded-full border-s-transparent h-8 w-8 animate-spin" />
          )}
          {selfUpload?.status === "uploading" && (
            <div className="w-full px-4">
              <div className="h-1 bg-gray-300 rounded-full w-full overflow-hidden">
                <div
                  className="h-1 bg-primary transition-all duration-300"
                  style={{ width: `${selfUpload?.progress}%` }}
                />
              </div>
            </div>
          )}
          {selfUpload?.status === "done" && (
            <div className="text-green-500 bg-white rounded-full p-2">
              <CheckIcon className="w-6 h-6" />
            </div>
          )}
          {selfUpload?.status === "error" && (
            <div className="text-red-500 bg-white rounded-full p-2">
              <Cross2Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>
      <img
        className="object-cover w-full h-full"
        src={URL.createObjectURL(upload.file)}
        alt=""
      />
    </Card>
  );
}

export default UploadDialog;

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import AlbumForm from "../../components/AlbumForm";
import { Album } from "@/app/lib/prisma";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

const EditAlbumSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string().optional(),
});

export default function EditDialog({
  album,
  refresh,
}: {
  album: Album;
  refresh: () => Promise<void>;
}) {
  const form = useForm<z.infer<typeof EditAlbumSchema>>({
    resolver: zodResolver(EditAlbumSchema),
    defaultValues: {
      title: album.title,
      date: new Date(album.date),
      description: album.description,
    },
  });

  useEffect(() => {
    form.reset({
      title: album.title,
      date: new Date(album.date),
      description: album.description,
    });
  }, [album]);

  async function handleSubmit(data: z.infer<typeof EditAlbumSchema>) {
    const response = await fetch(`/api/admin/gallery/${album.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Check if JSON is returned
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        const { message } = await response.json();
        throw new Error(message);
      } else {
        throw new Error("Nie udało się zaktualizować albumu");
      }
    }

    await refresh();

    return "Zaktualizowano album";
  }

  return (
    <AlbumForm form={form} handleForm={handleSubmit} saveMessage="Zapisz">
      <Button size="icon" variant="outline">
        <Pencil1Icon />
      </Button>
    </AlbumForm>
  );
}

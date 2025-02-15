import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import AlbumForm from "./AlbumForm";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

const NewAlbumSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string().optional(),
});

function NewAlbum({ refresh }: { refresh: () => Promise<void> }) {
  const form = useForm<z.infer<typeof NewAlbumSchema>>({
    resolver: zodResolver(NewAlbumSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      description: "",
    },
  });

  async function handleSubmit(data: z.infer<typeof NewAlbumSchema>) {
    const response = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        const { message } = await response.json();
        throw new Error(message);
      } else {
        throw new Error("Nie udało się utworzyć albumu");
      }
    }

    await refresh();
  }

  return (
    <AlbumForm
      form={form}
      handleForm={handleSubmit}
      content={{
        title: "Nowy album",
        description: "Dodaj nowy album do galerii",
        errorMessage: "Nie udało się utworzyć albumu",
        successMessage: "Dodano nowy album",
        saveLabel: "Dodaj",
      }}
    >
      <Button className="absolute right-2 md:static md:right-auto" size="icon">
        <PlusIcon />
      </Button>
    </AlbumForm>
  );
}

export default NewAlbum;

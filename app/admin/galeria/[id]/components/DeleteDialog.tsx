import React, { useState } from "react";

import Dialog from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Album } from "@/app/lib/prisma";
import { toast } from "sonner";

function DeleteDialog({ album }: { album?: Album }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!album) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/gallery/${album.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/galeria");
      } else {
        throw new Error("Failed to delete album");
      }
    } catch (error) {
      toast.error("Nie udało się usunąć albumu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button size="icon" variant="destructive">
          <TrashIcon />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="max-w-xs rounded-xl pt-8 sm:pt-6">
        <Dialog.Header>
          <Dialog.Title>Czy na pewno chcesz usunąć ten album?</Dialog.Title>
          <Dialog.Description>
            Usunięcie albumu spowoduje usunięcie wszystkich zdjęć w nim
            zawartych. Tej operacji nie można cofnąć.
          </Dialog.Description>
          <Dialog.Footer className="flex-col gap-2 pt-2 justify-between sm:justify-between">
            <Dialog.Close asChild>
              <Button variant="outline">Anuluj</Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading && (
                <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
              )}
              Usuń
            </Button>
          </Dialog.Footer>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog>
  );
}

export default DeleteDialog;

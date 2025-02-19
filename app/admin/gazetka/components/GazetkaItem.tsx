import { Newspaper } from "@/app/lib/prisma";
import { Card } from "@/components/ui/card";
import { DeleteOutlineRounded, EditRounded } from "@mui/icons-material";
import { useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/pl";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Cross2Icon, BookmarkIcon } from "@radix-ui/react-icons";
dayjs.locale("pl");

type GazetkaItemProps = {
  newspaper: Newspaper;
  update: () => Promise<void>;
};

function GazetkaItem(props: GazetkaItemProps) {
  const { newspaper, update } = props;
  const [loading, setLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/newspaper/${newspaper.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error);
      }

      toast.success("Pomyślnie usunięto gazetkę");
    } catch (error) {
      toast.error("Wystąpił błąd podczas usuwania gazetki");
    } finally {
      await update();
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <Card key={newspaper.id} className="p-4">
      {editMode ? (
        <></>
      ) : (
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex flex-col sm:flex-row sm:gap-2 md:gap-4 sm:items-center">
              <div className="flex items-end gap-1">
                <p className="font-light">nr.</p>
                <h3 className="text-2xl">{newspaper.title}</h3>
              </div>
              <p className="text-gray-500 font-light capitalize text-sm sm:text-base">
                {dayjs(newspaper.date).format("MMMM YYYY")}
              </p>
            </div>
            <a
              href={`/public/${newspaper.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Otwórz
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setEditMode(true)}
              disabled
            >
              <EditRounded />
            </Button>
            <Button
              size="icon"
              variant="default"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
              ) : (
                <DeleteOutlineRounded />
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default GazetkaItem;

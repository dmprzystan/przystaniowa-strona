import { Newspaper } from "@/app/lib/prisma";
import { Card } from "@/components/ui/card";
import { DeleteOutlineRounded, EditRounded } from "@mui/icons-material";
import { useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/pl";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
        <form
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
          onSubmit={(e) => {
            handleEdit(e, newspaper.id);
            setEditMode(false);
          }}
        >
          <div className="flex flex-col lg:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
            <div className="flex flex-row items-start sm:items-end gap-4 w-full xl:w-auto">
              <div className="flex flex-row items-end gap-1">
                <p className="font-light pl-2 sm:pl-0">nr.</p>
                <input
                  className="text-xl px-2 py-1 rounded-lg shadow-arround focus:outline-none focus:bg-gray-100 transition duration-200 w-16"
                  type="number"
                  name="title"
                  id="title"
                  defaultValue={newspaper.title}
                />
              </div>
              <input
                type="date"
                className="text-xl px-2 py-1 rounded-lg shadow-arround focus:outline-none focus:bg-gray-100 transition duration-200 w-full sm:w-40 xl:w-44 bg-white"
                defaultValue={newspaper.date.toISOString().split("T")[0]}
                name="date"
                id="date"
              />
            </div>
            <input
              className="w-full shadow-arround focus:outline-none focus:bg-gray-100 transition duration-200 rounded-lg file:bg-gray-100 file:outline-none file:border-none file:px-4 file:py-2 file:mr-2 pr-2"
              id="file-upload"
              type="file"
              name="file"
              accept=".pdf"
            />
          </div>
          <div className="flex items-center md:flex-col lg:flex-row gap-4 sm:gap-2 md:gap-4 justify-between lg:justify-normal w-full lg:w-auto">
            <button
              className="bg-red-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
              onClick={() => setEditMode(false)}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
            >
              Zapisz
            </button>
          </div>
        </form>
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
              disabled={loading}
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

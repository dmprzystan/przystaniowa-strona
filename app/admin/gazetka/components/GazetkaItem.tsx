import { Newspaper } from "@/app/lib/prisma";
import { DeleteOutlineRounded, EditRounded } from "@mui/icons-material";
import { useState } from "react";

type GazetkaItemProps = {
  newspaper: Newspaper;
  handleDelete: (id: string) => void;
  handleEdit: (
    e: React.FormEvent<HTMLFormElement>,
    id: string
  ) => Promise<void>;
};

function GazetkaItem(props: GazetkaItemProps) {
  const { newspaper, handleDelete, handleEdit } = props;

  const [editMode, setEditMode] = useState(false);

  const months = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];

  return (
    <div
      key={newspaper.id}
      className="bg-gray-100 p-4 rounded-2xl shadow-arround  hover:bg-gray-200 duration-200 transition-all"
    >
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
              <p className="text-gray-500 font-light text-sm sm:text-base">{`${
                months[newspaper.date.getMonth()]
              } ${newspaper.date.getFullYear()}`}</p>
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
          <div className="flex items-center gap-4">
            <button
              className="bg-blue-500 text-white rounded-full sm:rounded-lg p-3 sm:px-4 sm:py-2 shadow-lg sm:shadow-none hover:shadow-lg duration-300 transition-all"
              onClick={() => setEditMode(true)}
            >
              <div className="hidden sm:block">Edytuj</div>
              <div className="block sm:hidden">
                <EditRounded />
              </div>
            </button>
            <button
              className="bg-red-500 text-white rounded-full sm:rounded-lg p-3 sm:px-4 sm:py-2 shadow-lg sm:shadow-none hover:shadow-lg duration-300 transition-all"
              onClick={() => {
                handleDelete(newspaper.id);
              }}
            >
              <div className="hidden sm:block">Usuń</div>
              <div className="block sm:hidden">
                <DeleteOutlineRounded />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GazetkaItem;

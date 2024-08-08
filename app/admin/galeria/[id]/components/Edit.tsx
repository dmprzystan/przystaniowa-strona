import { Album } from "@/app/lib/prisma";
import { CloseRounded, DeleteRounded, SaveRounded } from "@mui/icons-material";
import React, { useEffect } from "react";

type EditProps = {
  album: Album;
  onClose: () => void;
  onSubmit: () => void;
};

function Edit({ album, onClose, onSubmit }: EditProps) {
  const [title, setTitle] = React.useState(album.title);
  const [date, setDate] = React.useState(
    album.date.toISOString().split("T")[0]
  );
  const [description, setDescription] = React.useState(album.description);

  useEffect(() => {
    setTitle(album.title);
    setDate(album.date.toISOString().split("T")[0]);
    setDescription(album.description);
  }, [album]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const body = JSON.stringify({ title, date, description });
    const res = await fetch(`/api/admin/gallery/${album.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (res.ok) {
      onSubmit();
      onClose();
    } else {
      alert("Wystąpił błąd");
    }
  }

  async function handleDelete() {
    if (confirm("Czy na pewno chcesz usunąć ten album?")) {
      const res = await fetch(`/api/admin/gallery/${album.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        window.location.replace("/admin/galeria");
      } else {
        alert("Wystąpił błąd");
      }
    }
  }

  return (
    <div
      className="fixed w-full h-full left-0 top-0 bg-white bg-opacity-30 backdrop-blur-md flex justify-center items-center z-50"
      onClick={onClose}
    >
      <form
        className="bg-white px-6 py-6 rounded-3xl mx-4 w-full sm:w-[500px] shadow-2xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onSubmit={handleSubmit}
      >
        <div className="relative flex items-center justify-center">
          <h2 className="text-2xl text-center flex gap-2 items-center justify-center font-semibold">
            Edytuj album
          </h2>
          <button
            className="absolute right-0 hover:rotate-90 rotate-0 transition-all text-gray-600 hover:text-black"
            onClick={onClose}
          >
            <CloseRounded />
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <label htmlFor="title" className="text-gray-500 ml-2">
            Tytuł
          </label>
          <input
            className="w-full shadow-arround focus:outline-none focus:bg-gray-100 transition duration-200 px-4 py-2 rounded-lg"
            type="text"
            name="title"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <label htmlFor="date" className="text-gray-500 ml-2">
            Data
          </label>
          <input
            className="w-full shadow-arround focus:outline-none focus:bg-gray-100 transition duration-200 px-4 py-2 rounded-lg"
            type="date"
            name="date"
            id="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <label htmlFor="description" className="text-gray-500 ml-2">
            Opis
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            className="w-full shadow-arround focus:outline-none focus:bg-gray-100 transition duration-200 px-4 py-2 rounded-lg resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            className="flex items-center gap-2 bg-red-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
            onClick={handleDelete}
          >
            <DeleteRounded />
            Usuń
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
          >
            <SaveRounded />
            Zapisz
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;

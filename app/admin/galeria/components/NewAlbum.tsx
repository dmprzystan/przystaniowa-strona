import React from "react";

type NewAlbumProps = {
  onClose: () => void;
  onSubmit: () => void;
};

function NewAlbum({ onClose, onSubmit }: NewAlbumProps) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const description = formData.get("description") as string;

    if (!title || !date) {
      alert("Tytuł i data są wymagane");
      return;
    }

    const body = JSON.stringify({ title, date, description });

    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (res.ok) {
      form.reset();
      onSubmit();
      onClose();
    } else {
      alert("Wystąpił błąd");
    }
  }

  return (
    <div
      className="fixed w-full h-full left-0 top-0 bg-white bg-opacity-30 backdrop-blur-md flex justify-center items-center z-50"
      onClick={onClose}
    >
      <form
        className="bg-white px-6 py-4 rounded-3xl w-[500px]"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl text-center">Nowy album</h2>
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
            defaultValue={new Date().toISOString().split("T")[0]} // today's date
            required
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
          ></textarea>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            className="bg-red-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
            onClick={onClose}
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
          >
            Dodaj
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewAlbum;

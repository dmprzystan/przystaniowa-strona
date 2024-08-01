import React from "react";

type NewAlbumProps = {
  onClose: () => void;
};

function NewAlbum({ onClose }: NewAlbumProps) {
  return (
    <div
      className="fixed w-full h-full left-0 top-0 bg-white bg-opacity-30 backdrop-blur-md flex justify-center items-center"
      onClick={onClose}
    >
      <form
        className="bg-white px-6 py-4 rounded-3xl w-[500px]"
        onClick={(e) => {
          e.stopPropagation();
        }}
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
            type="submit"
            className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
          >
            Dodaj
          </button>
          <button
            type="button"
            className="bg-red-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
            onClick={onClose}
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewAlbum;

"use client";

import { useState } from "react";
import { Newspaper } from "@/app/lib/prisma";
import GazetkaItem from "./GazetkaItem";

type GazetkaProps = {
  newspapers: Newspaper[];
};

const APILink = "/api/admin/newspaper";

function Gazetka(props: GazetkaProps) {
  const [clientNewspapers, setClientNewspapers] = useState(props.newspapers);

  const [addModal, setAddModal] = useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch(APILink, {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      setAddModal(false);
    }

    getNewspapers();
  };

  const handleDelete = async (id: string) => {
    setClientNewspapers((prev) => prev.filter((item) => item.id !== id));

    await fetch(`${APILink}/${id}`, {
      method: "DELETE",
    });

    getNewspapers();
  };

  const handleEdit = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    setClientNewspapers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title: data.get("title") as string,
            date: new Date(data.get("date") as string),
          };
        }
        return item;
      })
    );

    await fetch(`${APILink}/${id}`, {
      method: "PUT",
      body: data,
    });

    getNewspapers();
  };

  const getNewspapers = async () => {
    const res = await fetch(APILink);
    const data = (await res.json()) as {
      id: string;
      title: string;
      date: string;
      url: string;
    }[];

    const parsedData = data
      .map((item) => ({
        id: item.id,
        title: item.title,
        date: new Date(item.date),
        url: item.url,
      }))
      .sort((a, b) => b.date.valueOf() - a.date.valueOf());

    setClientNewspapers(parsedData);
  };

  return (
    <>
      <div className="px-4 sm:px-16 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl text-center">GAZETKA 19tka</h2>
          <button
            className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
            onClick={() => {
              setAddModal(true);
            }}
          >
            Dodaj
          </button>
        </div>
        <div className="flex flex-col mt-8 gap-8">
          {clientNewspapers.map((newspaper) => (
            <GazetkaItem
              newspaper={newspaper}
              key={newspaper.id}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
        </div>
      </div>

      {addModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-30 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white rounded-2xl px-12 py-8">
            <form className="flex flex-col gap-4" onSubmit={handleAdd}>
              <div className="flex flex-col gap-1">
                <label htmlFor="title" className="text-gray-500 ml-2">
                  Numer
                </label>
                <input
                  className="w-full shadow-arround focus:outline-none focus:bg-gray-100 transition duration-200 px-4 py-2 rounded-lg"
                  type="number"
                  name="title"
                  id="title"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="date" className="text-gray-500 ml-2">
                  Data
                </label>
                <input
                  className="w-full shadow-arround focus:outline-none focus:bg-gray-100 transition duration-200 px-4 py-2 rounded-lg"
                  type="date"
                  name="date"
                  id="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="file-upload" className="text-gray-500 ml-2">
                  Plik
                </label>
                <input
                  className="w-full shadow-arround focus:outline-none focus:bg-gray-100 transition duration-200 rounded-lg file:bg-gray-100 file:outline-none file:border-none file:px-4 file:py-2 file:mr-2 pr-2"
                  id="file-upload"
                  type="file"
                  name="file"
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-red-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
                  onClick={() => setAddModal(false)}
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
        </div>
      )}
    </>
  );
}

export default Gazetka;

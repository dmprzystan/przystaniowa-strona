"use client";
import { Inter } from "next/font/google";

import Link from "next/link";
import Editor from "./components/Editor";
import React, { useState } from "react";

import { CloseRounded, InsertDriveFileRounded } from "@mui/icons-material";

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

type Attachment = {
  file: File;
  name: string;
};

const APILink = "/api/admin/trips";

export default function Page() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [links, setLinks] = useState<{ name: string; url: string }[]>([]);
  const [highlight, setHighlight] = useState(false);
  const [highlightAttachments, setHighlightAttachments] = useState(false);
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<Attachment[]>([]);

  const [title, setTitle] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    const formData = new FormData();

    if (!title) {
      alert("Tytuł nie może być pusty");
      return;
    }
    formData.append("title", title);

    if (!dateStart || !dateEnd) {
      alert("Data nie może być pusta");
      return;
    }
    formData.append("dateStart", dateStart);
    formData.append("dateEnd", dateEnd);

    if (!description) {
      alert("Opis nie może być pusty");
      return;
    }
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    if (attachments.length > 0) {
      attachments.forEach((attachment) => {
        const newFile = new File([attachment.file], attachment.name, {
          type: attachment.file.type,
        });

        formData.append("attachments", newFile);
      });
    }

    if (links.length > 0) {
      links.forEach((link) => {
        formData.append("links", JSON.stringify(link));
      });
    }

    fetch(APILink, {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.ok) {
        alert("Dodano wyjazd");
        window.location.href = "/admin/wyjazdy";
      } else {
        alert("Wystąpił błąd");
      }
    });
  };

  const handleNewFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    const newAttachments = newFiles.map((file) => ({
      file,
      name: file.name,
    }));
    setAttachmentsToAdd(newAttachments);
  };

  const handleAddLink = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("link-name") as string;
    const url = formData.get("link-url") as string;

    if (name && url) {
      setLinks([...links, { name, url }]);
      form.reset();
    }
  };

  return (
    <div className={`w-full ${inter.className}`}>
      <div className="flex justify-between w-full items-center">
        <h1 className="text-4xl text-center">Nowy wyjazd</h1>
        <div className="flex gap-4">
          <Link
            href="/admin/wyjazdy"
            className="bg-red-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
          >
            Anuluj
          </Link>
          <button
            className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
            onClick={handleSubmit}
          >
            Dodaj
          </button>
        </div>
      </div>
      <div className="flex gap-8 flex-col mt-12">
        <div className="flex flex-row gap-8">
          <div className="flex gap-2 flex-col flex-grow">
            <h2 className="text-2xl ml-4">Tytuł</h2>
            <div className=" bg-white px-6 py-4 rounded-3xl shadow-md flex-1 flex-grow flex items-center">
              <input
                type="text"
                placeholder="Tytuł"
                className="w-full border-0 outline-none text-xl"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-2xl ml-4">Data</h2>
            <div className=" bg-white px-6 py-4 rounded-3xl shadow-md flex gap-4">
              <div className="flex flex-col">
                <label htmlFor="date-end" className="text-gray-600 font-light">
                  Data rozpoczęcia
                </label>
                <input
                  type="date"
                  id="date-start"
                  name="date-start"
                  className="border-0 outline-none bg-gray-200 px-2 py-1 rounded-lg shadow-sm focus:bg-gray-300 transition-all"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="date-end" className="text-gray-600 font-light">
                  Data zakończenia
                </label>
                <input
                  type="date"
                  id="date-end"
                  name="date-end"
                  className="border-0 outline-none bg-gray-200 px-2 py-1 rounded-lg shadow-sm focus:bg-gray-300 transition-all"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-col">
          <h2 className="text-2xl ml-4">Zdjęcie</h2>
          <div className=" bg-white px-6 py-4 rounded-3xl shadow-md">
            <label
              htmlFor="image-input"
              className="flex items-center justify-center px-4 py-4 w-full h-[800px] bg-gray-200 rounded-3xl cursor-pointer border-dashed border-4 border-gray-300 hover:border-gray-400 data-[drop]:border-gray-400 transition-all duration-200"
              onDragOver={(e) => {
                e.preventDefault();
                setHighlight(true);
              }}
              onDragLeave={() => {
                setHighlight(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setHighlight(false);
                setImage(e.dataTransfer.files[0]);
              }}
              {...(highlight ? { "data-drop": "true" } : {})}
            >
              {image ? (
                <div className="flex relative items-center justify-center h-full">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Zdjęcie"
                    className="w-full h-full object-contain rounded-3xl"
                  />
                  <button
                    className="absolute top-4 right-4 bg-red-500 rounded-full px-1 py-1 hover:bg-red-400 transition-all duration-200 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setImage(null);
                    }}
                  >
                    <CloseRounded />
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 text-center font-semibold">
                    Przeciągnij zdjęcie tutaj
                  </p>
                  <p className="text-gray-600 text-center">
                    lub kliknij, aby wybrać
                  </p>
                </div>
              )}
              <input
                type="file"
                id="image-input"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>
        <div className="flex gap-2 flex-col">
          <h2 className="text-2xl ml-4">Opis</h2>
          <div className=" bg-white px-6 py-4 rounded-3xl shadow-md">
            <Editor value={description} setValue={setDescription} />
          </div>
        </div>
        <div className="flex flex-row gap-8">
          <div className="flex gap-2 flex-col flex-grow">
            <h2 className="text-2xl ml-4">Załączniki</h2>
            <div className=" bg-white px-6 py-4 rounded-3xl shadow-md">
              <label
                htmlFor="attachments-input"
                className="flex items-stretch justify-center px-4 py-4 w-full bg-gray-200 rounded-3xl cursor-pointer border-dashed border-4 border-gray-300 hover:border-gray-400 data-[drop]:border-gray-400 transition-all duration-200"
                onDragOver={(e) => {
                  e.preventDefault();
                  setHighlightAttachments(true);
                }}
                onDragLeave={() => {
                  setHighlightAttachments(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setHighlightAttachments(false);

                  handleNewFiles(e.dataTransfer.files);
                }}
                {...(highlightAttachments ? { "data-drop": "true" } : {})}
              >
                {attachments.length > 0 ? (
                  <div className="flex items-stretch justify-center h-full w-full flex-grow">
                    <ul className="flex flex-col gap-2 flex-grow">
                      {attachments.map((attachment, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg w-full justify-between"
                        >
                          <div className="flex flex-row gap-4">
                            <InsertDriveFileRounded />
                            <p className="w-64 text-ellipsis whitespace-nowrap overflow-hidden">
                              {attachment.name}
                            </p>
                          </div>
                          <button
                            className="bg-red-500 rounded-full px-1 py-1 hover:bg-red-400 transition-all duration-200 shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setAttachments(
                                attachments.filter((_, index) => index !== i)
                              );
                            }}
                          >
                            <CloseRounded />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 text-center font-semibold">
                      Przeciągnij załącznik tutaj
                    </p>
                    <p className="text-gray-600 text-center">
                      lub kliknij, aby wybrać
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  id="attachments-input"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    handleNewFiles(e.target.files);
                  }}
                />
              </label>
            </div>
          </div>
          <div className="flex gap-2 flex-col flex-grow">
            <h2 className="text-2xl ml-4">Linki</h2>
            <div className=" bg-white px-6 py-4 rounded-3xl shadow-md">
              {links.length > 0 && (
                <>
                  <div className="flex flex-col gap-2">
                    {links.map((link, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="flex gap-2 items-center">
                          <a
                            href={link.url}
                            target="_blank"
                            className="text-blue-500 hover:underline text-xl"
                          >
                            {link.name}
                          </a>
                          <p className="text-sm font-light text-gray-600">
                            <span className="font-normal">Adres: </span>
                            {link.url}
                          </p>
                        </div>
                        <button
                          className="bg-red-500 text-white rounded-full px-1 py-1 hover:bg-red-400 transition-all duration-200 shadow-lg"
                          onClick={() => {
                            setLinks(links.filter((_, index) => index !== i));
                          }}
                        >
                          <CloseRounded />
                        </button>
                      </div>
                    ))}
                  </div>
                  <hr className="my-2" />
                </>
              )}
              <form
                className="flex justify-between items-center gap-6"
                onSubmit={handleAddLink}
              >
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="link-name"
                      className="text-gray-600 font-light text-sm ml-2"
                    >
                      Nazwa
                    </label>
                    <input
                      type="text"
                      id="link-name"
                      name="link-name"
                      className="border-0 outline-none bg-gray-200 px-4 py-2 rounded-lg shadow-sm focus:bg-gray-300 transition-all w-96 text-xl mt-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="link-url"
                      className="text-gray-600 font-light text-sm ml-2"
                    >
                      Adres
                    </label>
                    <input
                      type="url"
                      id="link-url"
                      name="link-url"
                      className="border-0 outline-none bg-gray-200 px-4 py-2 rounded-lg shadow-sm focus:bg-gray-300 transition-all w-96 text-xl mt-1"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
                >
                  Dodaj
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {attachmentsToAdd.length > 0 && (
        <div className="w-full h-full fixed left-0 top-0 bg-white bg-opacity-25 backdrop-blur-lg flex items-center justify-center">
          <div className="bg-white px-8 py-4 rounded-xl flex flex-col gap-8">
            <h3 className="text-2xl text-center">Dodaj załącznik</h3>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="file-name"
                className="text-sm font-light text-gray-600 ml-2"
              >
                Nazwa pliku
              </label>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  name=""
                  id="file-name"
                  defaultValue={attachmentsToAdd[0].name.split(".")[0]}
                  className="border-0 outline-none bg-gray-200 px-2 py-1 rounded-lg shadow-sm focus:bg-gray-300 transition-all min-w-64"
                  onChange={(e) => {
                    const name = e.target.value;
                    const extension =
                      attachmentsToAdd[0].file.name.split(".")[1];

                    const newName = `${name}.${extension}`;
                    setAttachmentsToAdd([
                      {
                        file: attachmentsToAdd[0].file,
                        name: newName,
                      },
                    ]);
                  }}
                />
                <InsertDriveFileRounded />
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <button
                className="bg-red-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
                onClick={() => {
                  setAttachmentsToAdd([...attachmentsToAdd.slice(1)]);
                }}
              >
                Usuń
              </button>
              <button
                className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
                onClick={() => {
                  setAttachments([
                    ...attachments,
                    {
                      file: attachmentsToAdd[0].file,
                      name: attachmentsToAdd[0].name,
                    },
                  ]);
                  setAttachmentsToAdd([...attachmentsToAdd.slice(1)]);
                  if (attachmentsToAdd.length > 1 && inputRef.current) {
                    inputRef.current.value =
                      attachmentsToAdd[1].name.split(".")[0];
                    inputRef.current?.focus();
                  }
                }}
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

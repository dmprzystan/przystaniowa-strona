"use client";

import { Trip } from "@/app/lib/prisma";
import Wyjazd from "./Wyjazd";
import { useState, useRef, useEffect } from "react";
import { CloseRounded, InsertDriveFileRounded } from "@mui/icons-material";
import ImageUpload from "./ImageUpload";
import Editor from "../add/components/Editor";
import React from "react";

type Attachment = {
  file: File;
  name: string;
};

type Link = {
  url: string;
  name: string;
};

interface TripAdmin {
  id: string;
  title: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  image: File | null;
  attachments: Attachment[];
  links: Link[];
}

function Wyjazdy(props: { trips: Trip[] }) {
  const [trips, setTrips] = useState<Trip[]>(props.trips);
  const [showModal, setShowModal] = useState(true);
  const [currentTrip, setCurrentTrip] = useState<TripAdmin | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkNameRef = useRef<HTMLInputElement>(null);
  const linkUrlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const [newAttachment, setNewAttachment] = useState<Attachment>({
    file: new File([], ""),
    name: "",
  });

  const deleteTrip = async (id: string) => {
    setTrips(trips.filter((trip) => trip.id !== id));

    const res = await fetch(`/api/admin/trips/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Wystąpił błąd podczas usuwania wyjazdu");
    }

    fetchTrips();
  };

  const fetchTrips = async () => {
    const res = await fetch("/api/admin/trips");

    if (!res.ok) {
      alert("Wystąpił błąd podczas pobierania wyjazdów");
      return;
    }

    try {
      const data = (await res.json()) as {
        id: string;
        title: string;
        description: string;
        dateStart: string;
        dateEnd: string;
        TripPhoto: { url: string }[];
        TripAttachment: { url: string; name: string }[];
        TripLink: { url: string; name: string }[];
      }[];

      const parsedTrips = data.map((trip) => {
        return {
          id: trip.id,
          title: trip.title,
          description: trip.description,
          dateStart: new Date(trip.dateStart),
          dateEnd: new Date(trip.dateEnd),
          TripPhoto: trip.TripPhoto || [],
          TripAttachment: trip.TripAttachment || [],
          TripLink: trip.TripLink || [],
        };
      });

      setTrips(parsedTrips);
    } catch (e) {
      alert("Wystąpił błąd podczas przetwarzania danych");
      return;
    }
  };

  const editTrip = async (trip: Trip) => {
    const res = await fetch(`/wyjazdy/${trip.TripPhoto[0].url}`);

    if (!res.ok) {
      alert("Wystąpił błąd podczas pobierania zdjęcia");
      return;
    }

    const image = new File([await res.blob()], trip.TripPhoto[0].url);

    const attachments = trip.TripAttachment.map((attachment) => ({
      file: new File([], attachment.url),
      name: attachment.name,
    }));

    const links = trip.TripLink.map((link) => ({
      url: link.url,
      name: link.name,
    }));

    const newTrip: TripAdmin = {
      id: trip.id,
      title: trip.title,
      description: trip.description,
      dateStart: new Date(trip.dateStart),
      dateEnd: new Date(trip.dateEnd),
      image: image,
      attachments: attachments,
      links: links,
    };

    setNewAttachment({
      file: new File([], ""),
      name: "",
    });

    setCurrentTrip(newTrip);
    setShowModal(true);
  };

  const addTrip = async () => {
    const newTrip: TripAdmin = {
      id: "",
      title: "",
      description: "",
      dateStart: new Date(),
      dateEnd: new Date(),
      image: null,
      attachments: [],
      links: [],
    };

    setCurrentTrip(newTrip);
    setNewAttachment({
      file: new File([], ""),
      name: "",
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTrip) return;

    if (!currentTrip.title) {
      alert("Tytuł nie może być pusty");
      return;
    }

    if (currentTrip.dateStart > currentTrip.dateEnd) {
      alert("Data zakończenia nie może być wcześniejsza niż data rozpoczęcia");
      return;
    }

    if (currentTrip.id) {
      const formData = new FormData();
      formData.append("id", currentTrip.id);
      formData.append("title", currentTrip.title);
      formData.append("description", currentTrip.description);
      formData.append("dateStart", currentTrip.dateStart.toISOString());
      formData.append("dateEnd", currentTrip.dateEnd.toISOString());

      if (currentTrip.image) {
        formData.append("image", currentTrip.image);
      }

      currentTrip.attachments.forEach((attachment) => {
        const file = new File([attachment.file], attachment.name);
        formData.append("attachments", file);
      });

      currentTrip.links.forEach((link) => {
        formData.append("links", JSON.stringify(link));
      });

      const res = await fetch("/api/admin/trips", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        alert("Wystąpił błąd podczas edytowania wyjazdu");
        return;
      }

      fetchTrips();
      setShowModal(false);
    } else {
      const formData = new FormData();
      formData.append("title", currentTrip.title);
      formData.append("description", currentTrip.description);
      formData.append("dateStart", currentTrip.dateStart.toISOString());
      formData.append("dateEnd", currentTrip.dateEnd.toISOString());

      if (currentTrip.image) {
        formData.append("image", currentTrip.image);
      }

      currentTrip.attachments.forEach((attachment) => {
        const file = new File([attachment.file], attachment.name);
        formData.append("attachments", file);
      });

      currentTrip.links.forEach((link) => {
        formData.append("links", JSON.stringify(link));
      });

      const res = await fetch("/api/admin/trips", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Wystąpił błąd podczas dodawania wyjazdu");
        return;
      }

      fetchTrips();
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="px-4 sm:px-16 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl text-center">Wyjazdy</h2>
          <button
            className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
            onClick={addTrip}
          >
            Dodaj
          </button>
        </div>
        <div className="flex flex-col gap-8 mt-16">
          {trips.map((trip) => (
            <Wyjazd
              trip={trip}
              handleDelete={deleteTrip}
              handleEdit={editTrip}
              key={trip.id}
            />
          ))}
        </div>
      </div>
      {/* 
      {showModal && currentTrip && (
        <div className="fixed left-0 top-0 w-full h-full bg-white bg-opacity-30 backdrop-blur-lg flex py-32 justify-center items-start overflow-y-scroll">
          <form
            className="bg-[#F2F2F2] xl:w-[1000px] px-8 py-6 rounded-3xl shadow-lg"
            onSubmit={handleFormSubmit}
          >
            <div className="flex justify-between items-center p-4">
              <h2 className="text-2xl">
                {currentTrip.id ? "Edytuj wyjazd" : "Dodaj wyjazd"}
              </h2>
              <button
                className="bg-red-500 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-none hover:shadow-lg duration-300 transition-all aspect-square"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                <CloseRounded className="w-6 h-6 block" />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-row gap-8 items-center">
                <div className="flex gap-2 flex-col flex-grow">
                  <h2 className="text-2xl ml-4">Tytuł</h2>
                  <div className=" bg-white px-6 py-4 rounded-xl shadow-md flex-1 flex-grow flex items-center">
                    <input
                      type="text"
                      placeholder="Tytuł"
                      className="w-full border-0 outline-none text-xl"
                      value={currentTrip.title}
                      onChange={(e) => {
                        setCurrentTrip({
                          ...currentTrip,
                          title: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-col">
                  <h2 className="text-2xl ml-4">Data</h2>
                  <div className=" bg-white px-6 py-4 rounded-xl shadow-md flex gap-4">
                    <div className="flex flex-col">
                      <label
                        htmlFor="date-end"
                        className="text-gray-600 font-light"
                      >
                        Data rozpoczęcia
                      </label>
                      <input
                        type="date"
                        id="date-start"
                        name="date-start"
                        className="border-0 outline-none bg-gray-200 px-2 py-1 rounded-lg shadow-sm focus:bg-gray-300 transition-all"
                        value={
                          currentTrip.dateStart.toISOString().split("T")[0]
                        }
                        onChange={(e) => {
                          setCurrentTrip({
                            ...currentTrip,
                            dateStart: new Date(e.target.value),
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="date-end"
                        className="text-gray-600 font-light"
                      >
                        Data zakończenia
                      </label>
                      <input
                        type="date"
                        id="date-end"
                        name="date-end"
                        className="border-0 outline-none bg-gray-200 px-2 py-1 rounded-lg shadow-sm focus:bg-gray-300 transition-all"
                        value={currentTrip.dateEnd.toISOString().split("T")[0]}
                        onChange={(e) => {
                          setCurrentTrip({
                            ...currentTrip,
                            dateEnd: new Date(e.target.value),
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-2xl ml-4">Zdjęcie</h2>
                <div className=" bg-white px-6 py-4 rounded-3xl shadow-md">
                  <ImageUpload
                    image={currentTrip.image}
                    setImage={(image) => {
                      setCurrentTrip({
                        ...currentTrip,
                        image,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-2xl ml-4">Opis</h2>
                <div className=" bg-white px-6 py-4 rounded-3xl shadow-md">
                  <Editor
                    value={currentTrip.description}
                    setValue={(value) => {
                      setCurrentTrip({
                        ...currentTrip,
                        description: value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <div className="flex gap-2 flex-col flex-grow">
                  <h2 className="text-2xl ml-4">Załączniki</h2>
                  <div className=" bg-white px-6 py-4 rounded-3xl shadow-md">
                    {currentTrip.attachments.length > 0 && (
                      <>
                        <div className="flex items-stretch justify-center h-full w-full flex-grow">
                          <ul className="flex flex-col gap-2 flex-grow">
                            {currentTrip.attachments.map((attachment, i) => (
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
                                    setCurrentTrip({
                                      ...currentTrip,
                                      attachments:
                                        currentTrip.attachments.filter(
                                          (_, index) => index !== i
                                        ),
                                    });
                                  }}
                                >
                                  <CloseRounded className="text-white" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <hr className="my-2" />
                      </>
                    )}
                    <div className="flex justify-between items-end gap-6">
                      <div className="flex gap-4 flex-grow">
                        <div className="flex flex-col">
                          <label
                            htmlFor="file-upload"
                            className="text-gray-600 font-light text-sm ml-2"
                          >
                            Plik
                          </label>
                          <input
                            className="w-full focus:outline-none bg-gray-200 focus:bg-gray-300 transition duration-200 rounded-lg file:bg-gray-300 file:outline-none file:border-none file:px-4 file:py-2.5 file:mr-2 pr-2 mt-1"
                            id="file-upload"
                            type="file"
                            name="file"
                            ref={fileInputRef}
                            onChange={(e) => {
                              if (e.target.files === null) return;

                              setNewAttachment({
                                file: e.target.files[0],
                                name: e.target.files[0].name
                                  .split(".")
                                  .slice(0, -1)
                                  .join("."),
                              });
                            }}
                          />
                        </div>
                        <div className="flex flex-col flex-grow">
                          <label
                            htmlFor="file-name"
                            className="text-gray-600 font-light text-sm ml-2"
                          >
                            Nazwa
                          </label>
                          <input
                            type="text"
                            id="file-name"
                            name="file-name"
                            className="border-0 outline-none bg-gray-200 px-4 py-2 rounded-lg shadow-sm focus:bg-gray-300 transition-all min-w-96 text-xl mt-1"
                            value={newAttachment?.name}
                            onChange={(e) => {
                              setNewAttachment({
                                file: newAttachment?.file as File,
                                name: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <button
                        className="bg-green-500 text-white rounded-lg py-2.5 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          if (
                            newAttachment.file.name === "" ||
                            !fileInputRef.current?.value
                          )
                            return;

                          const toAdd = {
                            file: newAttachment.file,
                            name: `${
                              newAttachment.name
                            }.${newAttachment.file.name.split(".").pop()}`,
                          };

                          setCurrentTrip({
                            ...currentTrip,
                            attachments: [...currentTrip.attachments, toAdd],
                          });
                          setNewAttachment({
                            file: new File([], ""),
                            name: "",
                          });

                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        Dodaj
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-col flex-grow">
                  <h2 className="text-2xl ml-4">Linki</h2>
                  <div className=" bg-white px-6 py-4 rounded-3xl shadow-md">
                    {currentTrip.links.length > 0 && (
                      <>
                        <div className="flex flex-col gap-2">
                          {currentTrip.links.map((link, i) => (
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setCurrentTrip({
                                    ...currentTrip,
                                    links: currentTrip.links.filter(
                                      (_, index) => index !== i
                                    ),
                                  });
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
                    <div className="flex justify-between items-end gap-6">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <label
                            htmlFor="link-name"
                            className="text-gray-600 font-light text-sm ml-2"
                          >
                            Nazwa
                          </label>
                          <input
                            ref={linkNameRef}
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
                            ref={linkUrlRef}
                            type="url"
                            id="link-url"
                            name="link-url"
                            className="border-0 outline-none bg-gray-200 px-4 py-2 rounded-lg shadow-sm focus:bg-gray-300 transition-all w-96 text-xl mt-1"
                          />
                        </div>
                      </div>
                      <button
                        className="bg-green-500 text-white rounded-lg py-2.5 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          if (
                            linkNameRef.current?.value === "" ||
                            linkUrlRef.current?.value === ""
                          )
                            return;

                          setCurrentTrip({
                            ...currentTrip,
                            links: [
                              ...currentTrip.links,
                              {
                                name: linkNameRef.current?.value || "",
                                url: linkUrlRef.current?.value || "",
                              },
                            ],
                          });

                          if (linkNameRef.current) {
                            linkNameRef.current.value = "";
                          }
                          if (linkUrlRef.current) {
                            linkUrlRef.current.value = "";
                          }
                        }}
                      >
                        Dodaj
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <button
                className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
                type="submit"
              >
                Zapisz
              </button>
            </div>
          </form>
        </div>
      )} */}
    </>
  );
}

export default Wyjazdy;

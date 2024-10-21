"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trip } from "@/app/lib/prisma";

import { EditRounded, DeleteRounded } from "@mui/icons-material";

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

function Wyjazd({
  trip,
  handleDelete,
  handleEdit,
}: {
  trip: Trip;
  handleDelete: (id: string) => Promise<void>;
  handleEdit: (trip: Trip) => void;
}) {
  const [showButtons, setShowButtons] = React.useState(false);

  const displayDate = (dateStart: Date, dateEnd: Date) => {
    const sameYear = dateStart.getFullYear() === dateEnd.getFullYear();
    const sameMonth = dateStart.getMonth() === dateEnd.getMonth();
    const sameDay = dateStart.getDate() === dateEnd.getDate();

    if (sameYear && sameMonth && sameDay) {
      return `${dateStart.getDate()} ${
        months[dateStart.getMonth()]
      } ${dateStart.getFullYear()}`;
    } else if (sameYear && sameMonth) {
      return `${dateStart.getDate()} - ${dateEnd.getDate()} ${
        months[dateStart.getMonth()]
      } ${dateStart.getFullYear()}`;
    } else if (sameYear) {
      return `${dateStart.getDate()} ${
        months[dateStart.getMonth()]
      } - ${dateEnd.getDate()} ${
        months[dateEnd.getMonth()]
      } ${dateStart.getFullYear()}`;
    } else {
      return `${dateStart.getDate()} ${
        months[dateStart.getMonth()]
      } ${dateStart.getFullYear()} - ${dateEnd.getDate()} ${
        months[dateEnd.getMonth()]
      } ${dateEnd.getFullYear()}`;
    }
  };

  return (
    <motion.div
      key={trip.id}
      onHoverStart={() => setShowButtons(true)}
      onHoverEnd={() => setShowButtons(false)}
      className="flex justify-between gap-8 h-[240px] relative"
    >
      <div>
        {/* <Image
          src={`/wyjazdy/${trip.TripPhoto[0].url}`}
          alt=""
          width={320}
          height={240}
          className="w-auto rounded-[3rem] shadow-lg h-full"
        /> */}
      </div>
      <div className="flex flex-col h-full">
        <div className="flex gap-4 items-center">
          <h2 className="text-2xl">{trip.title}</h2>
          <p className="text-base font-light">
            {displayDate(trip.dateStart, trip.dateEnd)}
          </p>
        </div>
        <div className="relative overflow-hidden">
          <div
            dangerouslySetInnerHTML={{ __html: trip.description }}
            className="prose overflow-hidden text-ellipsis text-pretty"
          />
          <div className="absolute w-full h-8 bg-gradient-to-b from-transparent to-[#F2F2F2] bottom-0 left-0" />
        </div>
        <div className="flex gap-4 pt-2">
          <p className="font-light">
            Linki: <span className="font-semibold">{trip.TripLink.length}</span>
          </p>
          <p className="font-light">
            Załączniki:{" "}
            <span className="font-semibold">{trip.TripAttachment.length}</span>
          </p>
        </div>
      </div>

      {showButtons && (
        <div className="absolute right-2 top-2 flex gap-4">
          <button
            className="p-2 rounded-full bg-white bg-opacity-30 backdrop-blur-md hover:bg-opacity-50 hover:shadow-lg shadow-none transition-all"
            onClick={() => handleEdit(trip)}
          >
            <EditRounded className="text-blue-600" />
          </button>
          <button
            className="p-2 rounded-full bg-white bg-opacity-30 backdrop-blur-md hover:bg-opacity-50 hover:shadow-lg shadow-none transition-all"
            onClick={() => handleDelete(trip.id)}
          >
            <DeleteRounded className="text-red-500" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default Wyjazd;

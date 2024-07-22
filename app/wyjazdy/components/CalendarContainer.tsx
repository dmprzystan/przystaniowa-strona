"use client";

import { motion, useDragControls } from "framer-motion";
import React, { useEffect } from "react";
import Calendar from "./Calendar";
import type { Trip } from "@/app/lib/prisma";

import {
  ArrowBackIosRounded,
  ArrowForwardIosRounded,
} from "@mui/icons-material";

const dragThreshold = 150;

function CalendarContainer(props: {
  month: number;
  year: number;
  trips: Trip[];
}) {
  const [month, setMonth] = React.useState(props.month ?? 0);
  const [year, setYear] = React.useState(props.year ?? 0);
  const [dragStart, setDragStart] = React.useState(-1);
  const [currentDrag, setCurrentDrag] = React.useState(0);

  const date = (year: number, month: number) => {
    if (month < 0) {
      return new Date(`${year - 1}-12-01`);
    } else if (month > 12) {
      return new Date(`${year + 1}-01-01`);
    }

    return new Date(`${year}-${month < 10 ? "0" + month : month}-01`);
  };

  return (
    <div className="flex items-center gap-8">
      <div className="hidden">
        <Calendar date={date(year, month - 1)} trips={props.trips} isSmaller />
      </div>
      <motion.div
        className="relative"
        drag="x"
        dragSnapToOrigin
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragStart={(event, info) => {
          setDragStart(info.point.x);
          setCurrentDrag(0);
        }}
        onDrag={(event, info) => {
          const diff = Math.abs(info.point.x - dragStart);
          setCurrentDrag(diff);
        }}
        onDragEnd={(event, info) => {
          if (info.point.x - dragStart > dragThreshold) {
            if (month === 1) {
              setYear(year - 1);
              setMonth(12);
            } else {
              setMonth(month - 1);
            }
          } else if (dragStart - info.point.x > dragThreshold) {
            if (month === 12) {
              setYear(year + 1);
              setMonth(1);
            } else {
              setMonth(month + 1);
            }
          }

          setCurrentDrag(0);
        }}
      >
        <button
          className={`focus:outline-none absolute -left-24 top-1/2 transform -translate-y-1/2`}
          onClick={() => {
            if (month === 1) {
              setYear(year - 1);
              setMonth(12);
            } else {
              setMonth(month - 1);
            }
          }}
        >
          <ArrowBackIosRounded
            className={`h-20 w-auto transition-all  duration-300 ${
              currentDrag > dragThreshold ? "text-dimmedBlue" : "text-[#DADADA]"
            }`}
          />
        </button>
        <Calendar date={date(year, month)} trips={props.trips} />
        <button
          className={`focus:outline-none absolute -right-24 top-1/2 transform -translate-y-1/2`}
          onClick={() => {
            if (month === 12) {
              setYear(year + 1);
              setMonth(1);
            } else {
              setMonth(month + 1);
            }
          }}
        >
          <ArrowForwardIosRounded
            className={`h-20 w-auto transition-all duration-300 ${
              currentDrag > dragThreshold ? "text-dimmedBlue" : "text-[#DADADA]"
            }`}
          />
        </button>
      </motion.div>
      <div className="hidden">
        <Calendar date={date(year, month + 1)} trips={props.trips} isSmaller />
      </div>
    </div>
  );
}

export default CalendarContainer;

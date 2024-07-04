import React from "react";
import type { Schedule as TSchedule } from "@/app/lib/prisma";

function Schedule({ schedule }: { schedule: TSchedule[] }) {
  const days = schedule.reduce((acc, { day, title, time }) => {
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push({ title, time });
    acc[day] = acc[day].sort((a, b) => a.time.localeCompare(b.time));
    return acc;
  }, {} as Record<string, { title: string; time: string }[]>);

  const daysOrder = [
    "poniedziałek",
    "wtorek",
    "środa",
    "czwartek",
    "piątek",
    "sobota",
    "niedziela",
  ];

  return (
    <div className="-mt-2 xl:-mt-10 2xl:-mt-14 z-10 relative">
      <img src="/images/bg-plan.svg" className="w-full" alt="" />
      <div className="bg-white py-6 md:pb-12 lg:pb-14 xl:pb-16 px-8 sm:px-12 lg:px-16 2xl:px-24 -mt-px rounded-b-2xl shadow-bottom">
        <h2 className="text-3xl sm:text-4xl xl:text-5xl uppercase text-center md:text-left">
          plan tygodnia
        </h2>
        <div className="flex flex-col md:flex-row flex-wrap mt-8 gap-8">
          {days &&
            daysOrder.map(
              (day) =>
                days[day] && (
                  <div
                    key={day}
                    className="flex-grow w-full md:w-5/12 relative border border-black rounded-3xl py-3 px-4 md:py-5 xl:py-6"
                  >
                    <h3 className="text-lg md:text-xl absolute bg-white -top-4 px-2 left-6">
                      {day}
                    </h3>
                    <ul className="text-lg md:text-xl">
                      {days[day].map(({ title, time }) => (
                        <li key={title}>
                          <span className="font-bold">{time}</span> – {title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
}

export default Schedule;

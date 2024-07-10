"use client";

import { useState } from "react";
import ScheduleItem from "./ScheduleItem";

type ScheduleProps = {
  scheduledDays: Record<
    string,
    { title: string; time: string; id: string; day: string }[]
  >;
};

function Schedule(props: ScheduleProps) {
  const [clientSchedule, setClientSchedule] = useState(props.scheduledDays);

  const days = [
    "poniedziałek",
    "wtorek",
    "środa",
    "czwartek",
    "piątek",
    "sobota",
    "niedziela",
  ];

  const handleRemove = async (id: string) => {
    setClientSchedule((prev) => {
      const newSchedule = { ...prev };
      for (const day in newSchedule) {
        newSchedule[day] = newSchedule[day].filter((item) => item.id !== id);
      }
      return newSchedule;
    });

    await fetch(`/api/schedule/${id}`, {
      method: "DELETE",
    });

    getNewSchedule();
  };

  const handleAdd = async (
    e: React.FormEvent<HTMLFormElement>,
    day: string
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const title = data.get("title") as string;
    const time = data.get("time") as string;

    if (!title || !time) {
      return;
    }

    setClientSchedule((prev) => {
      const newSchedule = { ...prev };
      if (!newSchedule[day]) {
        newSchedule[day] = [];
      }
      newSchedule[day] = [
        ...newSchedule[day],
        { title, time, id: Math.random().toString(), day },
      ].sort((a, b) => a.time.localeCompare(b.time));
      return newSchedule;
    });

    await fetch("/api/schedule", {
      method: "POST",
      body: JSON.stringify({ title, time, day }),
    });

    form.reset();

    getNewSchedule();
  };

  const getNewSchedule = async () => {
    const res = await fetch("/api/schedule");
    const data = (await res.json()) as {
      day: string;
      title: string;
      time: string;
      id: string;
    }[];
    const newSchedule = data.reduce((acc, { day, title, time, id }) => {
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push({ title, time, id, day });
      acc[day] = acc[day].sort((a, b) => a.time.localeCompare(b.time));
      return acc;
    }, {} as Record<string, { title: string; time: string; id: string; day: string }[]>);
    setClientSchedule(newSchedule);
  };

  return (
    <div className="px-4 sm:px-16 rounded-3xl">
      <h2 className="text-4xl text-left">Plan tygodnia</h2>
      <div className="flex flex-wrap mt-8 gap-8 justify-around">
        {days &&
          days.map((day) => (
            <div
              key={day}
              className="flex-grow w-full sm:w-[48%] relative border border-black rounded-3xl py-3 pt-6 px-4 last-of-type:flex-grow-0 flex flex-col justify-between"
            >
              <h3 className="text-lg absolute bg-[#F2F2F2] -top-4 px-2 left-6">
                {day}
              </h3>
              <ul className="text-lg pb-4 flex-col flex gap-4 cursor-pointer">
                {clientSchedule[day] &&
                  clientSchedule[day].map(({ title, time, id }) => (
                    <ScheduleItem
                      key={id}
                      title={title}
                      time={time}
                      id={id}
                      handleRemove={handleRemove}
                    />
                  ))}
              </ul>
              <form
                onSubmit={(e) => handleAdd(e, day)}
                className="flex flex-col sm:flex-row gap-4 shadow-arround px-4 py-3 rounded-2xl items-center"
              >
                <input
                  type="time"
                  name="time"
                  id=""
                  className="px-4 py-2 rounded-lg shadow-arround flex-shrink-0 focus:outline-none focus:bg-gray-100 transition duration-200  w-full sm:w-auto"
                  defaultValue={"12:00"}
                />
                <input
                  type="text"
                  name="title"
                  className="w-full shadow-arround focus:outline-none focus:bg-gray-100 transition duration-200 px-4 py-2 rounded-lg"
                  placeholder="Tytuł"
                />
                <button
                  type="submit"
                  className="bg-white shadow-arround px-4 py-2 rounded-xl hover:bg-gray-100 transition duration-200 flex-shrink-0 w-full sm:w-auto"
                >
                  Dodaj
                </button>
              </form>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Schedule;

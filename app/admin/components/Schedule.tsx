"use client";

import { useState } from "react";
import Input from "@/app/components/Input";
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
    <div>
      <h2 className="text-4xl text-center">Plan tygodnia</h2>
      <div className="flex flex-col mt-8 gap-8">
        {days &&
          days.map((day) => (
            <div
              key={day}
              className="flex-grow w-full relative border border-black rounded-3xl py-3 px-4"
            >
              <h3 className="text-lg absolute bg-white -top-4 px-2 left-6">
                {day}
              </h3>
              <ul className="text-lg">
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
              <form onSubmit={(e) => handleAdd(e, day)}>
                <Input label="Godzina" name="time" type="time" required />
                <Input label="Tytuł" name="title" type="text" required />
                <button type="submit">Dodaj</button>
              </form>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Schedule;

"use client";

import { useState } from "react";
import ScheduleItem from "./ScheduleItem";
import { useMessage } from "../../AdminContext";

type ScheduleProps = {
  scheduledDays: Record<
    string,
    { title: string; time: string; id: string; day: string }[]
  >;
};

const APILink = "/api/admin/schedule";

function Schedule(props: ScheduleProps) {
  const { addToast } = useMessage();
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

    const res = await fetch(`${APILink}/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      addToast({ type: "success", message: "Pomyśnie usunięto wydarzenie" });
    } else {
      try {
        const data = await res.json();
        if (data.error) addToast({ type: "error", message: data.error });
        else addToast({ type: "error", message: "Wystąpił nieznany błąd" });
      } catch {
        addToast({ type: "error", message: "Wystąpił nieznany błąd" });
      }
    }

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

    const res = await fetch(APILink, {
      method: "POST",
      body: JSON.stringify({ title, time, day }),
    });

    if (res.ok) {
      addToast({ type: "success", message: "Pomyśnie dodano wydarzenie" });
    } else {
      try {
        const data = await res.json();
        if (data.error) addToast({ type: "error", message: data.error });
        else addToast({ type: "error", message: "Wystąpił nieznany błąd" });
      } catch {
        addToast({ type: "error", message: "Wystąpił nieznany błąd" });
      }
    }

    form.reset();

    getNewSchedule();
  };

  const getNewSchedule = async () => {
    const res = await fetch(APILink);
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
    <div className="px-4 md:px-6 xl:px-8 2xl:px-16 rounded-3xl mt-4 md:mt-0">
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
                className="flex flex-col sm:flex-row gap-4 md:gap-2 lg:gap-4 shadow-arround px-4 py-3 rounded-2xl items-center"
              >
                <input
                  type="time"
                  name="time"
                  id=""
                  className="hidden sm:block px-2 2xl:px-4 py-2 rounded-lg shadow-arround flex-shrink-0 focus:outline-none focus:bg-gray-100 transition duration-200  w-full sm:w-auto"
                  defaultValue={"12:00"}
                />
                <input
                  type="text"
                  name="title"
                  className="w-full shadow-arround focus:outline-none focus:bg-gray-100 transition duration-200 px-2 2xl:px-4 py-2 rounded-lg"
                  placeholder="Tytuł"
                />
                <button
                  type="submit"
                  className="hidden sm:block text-white bg-green-500 shadow-arround px-2 2xl:px-4 py-2 rounded-xl hover:bg-green-600 transition duration-200 flex-shrink-0 w-full sm:w-auto"
                >
                  Dodaj
                </button>
                <div className="sm:hidden grid grid-cols-2 w-full gap-2">
                  <input
                    type="time"
                    name="time"
                    id=""
                    className="px-4 py-2 rounded-lg shadow-arround focus:outline-none focus:bg-gray-100 transition duration-200 w-full"
                    defaultValue={"12:00"}
                  />
                  <button
                    type="submit"
                    className="bg-white shadow-arround px-4 py-2 rounded-xl hover:bg-gray-100 transition duration-200 w-full"
                  >
                    Dodaj
                  </button>
                </div>
              </form>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Schedule;

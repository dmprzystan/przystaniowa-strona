import { Trip } from "@/app/lib/prisma";
import React, { useEffect } from "react";

const days = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nie"];

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

function Calendar({
  date,
  trips,
  isSmaller = false,
}: {
  date: Date;
  trips: Trip[];
  isSmaller?: boolean;
}) {
  const month = date.getMonth();
  const year = date.getFullYear();
  const daysInMonth = new Date(year, month, 0).getDate();
  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const weeks = Math.ceil((daysInMonth + firstDay) / 7);

  const daysArray = Array.from({ length: weeks }, (_, i) => {
    return Array.from({ length: 7 }, (_, j) => {
      const day = i * 7 + j - firstDay + 1;
      return day > 0 && day <= daysInMonth ? day : null;
    });
  });

  const [tripDates, setTripDates] = React.useState<
    { start: number; end: number; id: string }[]
  >([]);

  const tripsThisMonth = React.useMemo(
    () =>
      trips.filter((trip) => {
        const tripStartDate = new Date(trip.dateStart);
        const tripEndDate = new Date(trip.dateEnd);

        return (
          (tripStartDate.getMonth() === month &&
            tripStartDate.getFullYear() === year) ||
          (tripEndDate.getMonth() === month &&
            tripEndDate.getFullYear() === year)
        );
      }),
    [trips, month, year]
  );

  useEffect(() => {
    const newTripDates = tripsThisMonth.map((trip) => {
      const tripStartDate = new Date(trip.dateStart);
      const tripEndDate = new Date(trip.dateEnd);

      return {
        start: tripStartDate.getDate(),
        end: tripEndDate.getDate(),
        id: trip.id,
      };
    });

    setTripDates(newTripDates);
  }, [tripsThisMonth]);

  return (
    <div>
      <div className="flex justify-center">
        <h3 className={`${isSmaller ? "text-lg" : "text-3xl"} font-light`}>
          {months[month]} {year}
        </h3>
      </div>
      <div
        className={`grid grid-cols-7 gap-y-1 ${
          isSmaller ? "mt-1 text-sm" : "mt-4 text-2xl"
        }`}
      >
        {days.map((day) => (
          <div key={`${year}-${month}-${day}`} className="text-center">
            {day}
          </div>
        ))}
        {daysArray.map((week, i) =>
          week.map((day, j) => {
            if (day === null) {
              return (
                <div
                  key={`day-${year}-${month}-${day}-${j}`}
                  className="text-center cursor-default  p-1"
                ></div>
              );
            }

            const isTripDay = tripDates.filter(
              (trip) => trip.start <= day && trip.end >= day
            );

            if (isTripDay.length === 0) {
              return (
                <div
                  key={`day-${year}-${month}-${day}-${j}`}
                  className="text-center cursor-default p-1"
                >
                  {day}
                </div>
              );
            }

            const isStartDay = tripDates.some(
              (trip) => trip.start === day && trip.end !== day
            );
            const isEndDay = tripDates.some(
              (trip) => trip.start !== day && trip.end === day
            );
            const isSOL = j === 0;
            const isEOL = j === 6;

            return (
              <div
                key={`day-${year}-${month}-${day}-${j}`}
                className={`text-center
                  ${
                    isStartDay || isEndDay
                      ? isStartDay
                        ? "rounded-l-full"
                        : "rounded-r-full"
                      : isSOL || isEOL
                      ? isSOL
                        ? "rounded-l-lg"
                        : "rounded-r-lg"
                      : ""
                  }

                  bg-[#4F5D75] text-white cursor-pointer p-1`}
                onClick={() => {
                  console.log(isTripDay[0].id);
                  window.scrollTo({
                    top:
                      (document.getElementById(isTripDay[0].id)?.offsetTop ||
                        80) - 80,
                    behavior: "smooth",
                  });
                }}
              >
                {day}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Calendar;

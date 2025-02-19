import Link from "next/link";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { Inter } from "next/font/google";
import { getTrips } from "../lib/prisma";
import CalendarContainer from "./components/CalendarContainer";
import Image from "next/image";
import { InsertDriveFile } from "@mui/icons-material";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  weight: ["400", "800"],
  subsets: ["latin", "latin-ext"],
});

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

async function page() {
  const trips = await getTrips();

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

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
    <>
      <Link href="/" className="focus:outline-none">
        <Header />
      </Link>
      <Navbar />
      <div className="pb-8 pt-4 md:pt-6 lg:pt-8 xl:pt-12 mt-8 sm:mt-4">
        <h2 className="text-3xl sm:text-4xl xl:text-5xl text-center">
          WYJAZDY
        </h2>
        <div className={`sm:mt-12 md:mt-16 mt-8 ${inter.className}`}>
          <div className="w-full flex justify-center relative bg-dimmedBlue">
            <div className="relative z-10 bg-[#F2F2F2] w-full rounded-bl-3xl sm:rounded-bl-[3rem] md:rounded-bl-[4rem] flex justify-center pb-8 overflow-hidden">
              <CalendarContainer month={month} year={year} trips={trips} />
            </div>
          </div>
          <div className="bg-dimmedBlue w-full rounded-tr-3xl sm:rounded-tr-[3rem] md:rounded-tr-[4rem] md:pt-2">
            <div className="container mx-auto flex flex-col items-center gap-12 md:gap-16 py-8 sm:py-12">
              {trips.map((trip) => (
                <div
                  className="w-full md:w-auto bg-white rounded-xl sm:rounded-3xl px-8 sm:px-16 py-8 sm:py-14 flex flex-col items-center gap-2"
                  key={trip.id}
                  id={trip.id}
                >
                  <h2 className="text-center text-2xl">{trip.title}</h2>
                  <p className="text-center text-lg">
                    {displayDate(trip.dateStart, trip.dateEnd)}
                  </p>
                  {trip.thumbnail && (
                    <div className="mt-4 w-full">
                      <Image
                        src={`/public/${trip.thumbnail}`}
                        alt=""
                        width={800}
                        height={500}
                        className="max-w-4xl w-full min-w-[300px] rounded-[3rem] shadow-lg h-auto"
                      />
                    </div>
                  )}
                  <div
                    className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mt-4"
                    dangerouslySetInnerHTML={{ __html: trip.description }}
                  />
                  {trip.TripAttachment.length > 0 && (
                    <div className="mt-4 w-full flex flex-col items-center sm:flex-row flex-wrap gap-4">
                      {trip.TripAttachment.map((attachment) => (
                        <a
                          key={attachment.name}
                          href={`/wyjazdy/${trip.id}/attachments/${attachment.url}`}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="bg-gray-500 text-white px-4 sm:px-8 py-4 sm:py-4 rounded-2xl cursor-pointer text-sm sm:text-base shadow-bottom transition-all duration-300 hover:bg-gray-600 w-full flex justify-center sm:w-auto"
                        >
                          <InsertDriveFile />
                          <span className="ml-2 mt-0.5">{attachment.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {trip.TripLink.length > 0 && (
                    <div className="flex flex-wrap mt-4 gap-4">
                      {trip.TripLink.map((link) => (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-dimmedBlue text-white block px-8 sm:px-16 py-4 sm:py-6 rounded-full cursor-pointer text-sm sm:text-base"
                          key={link.url}
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SpeedInsights />
      <Analytics />
    </>
  );
}

export const revalidate = false;

export default page;

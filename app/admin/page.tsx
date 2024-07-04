import Header from "../components/Header";
import Schedule from "./components/Schedule";
import { getSchedule } from "../lib/prisma";
import Link from "next/link";

export default async function Admin() {
  const schedule = await getSchedule();
  const scheduledDays = schedule.reduce((acc, { day, title, time, id }) => {
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push({ title, time, id, day });
    acc[day] = acc[day].sort((a, b) => a.time.localeCompare(b.time));
    return acc;
  }, {} as Record<string, { title: string; time: string; id: string; day: string }[]>);

  return (
    <>
      <Link href="/" className="focus:outline-none">
        <Header />
      </Link>
      <div className="container mx-auto mt-12">
        <Schedule scheduledDays={scheduledDays} />
      </div>
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

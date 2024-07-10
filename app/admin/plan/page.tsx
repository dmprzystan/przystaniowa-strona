import Schedule from "./components/Schedule";
import { getSchedule } from "@/app/lib/prisma";
import Navbar from "../components/Navbar";

export default async function Plan() {
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
      <Navbar />
      <Schedule scheduledDays={scheduledDays} />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

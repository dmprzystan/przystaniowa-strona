import Navbar from "@/app/admin/components/Navbar";
import { getTrip, type Trip } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Wyjazd from "./Wyjazd";

export default async function Page({ params }: { params: { id: string } }) {
  let trip: Trip;

  try {
    trip = await getTrip(params.id);
  } catch (e) {
    redirect("/admin/wyjazdy");
  }

  return (
    <>
      <Navbar />
      <Wyjazd trip={trip} />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

import { getTrips } from "@/app/lib/prisma";

import Navbar from "../components/Navbar";
import Wyjazdy from "./components/Wyjazdy";

export default async function Page() {
  const trips = await getTrips();
  return (
    <>
      <Navbar />
      <Wyjazdy trips={trips} />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

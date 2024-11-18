import { getEmail } from "../lib/prisma";
import Navbar from "./components/Navbar";
import StronaGlowna from "./components/StronaGlowna";

export default async function Admin() {
  const email = await getEmail();

  return (
    <>
      <Navbar />
      <StronaGlowna email={email?.email} />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

import { readFile } from "@/app/lib/b2";

import Navbar from "../components/Navbar";
import Bierzmowanie from "./components/Bierzmowanie";
import { getConfirmationLinks } from "@/app/lib/prisma";

export default async function Page() {
  const confirmation = await readFile("bierzmowanie/bierzmowanie.html");
  const links = await getConfirmationLinks();
  return (
    <>
      <Navbar />
      <Bierzmowanie confirmation={confirmation} links={links} />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

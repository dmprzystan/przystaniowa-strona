import { getConfirmation } from "@/app/lib/oci";

import Navbar from "../components/Navbar";
import Bierzmowanie from "./components/Bierzmowanie";
import { getConfirmationLinks } from "@/app/lib/prisma";

export default async function Page() {
  const confirmation = await getConfirmation();
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

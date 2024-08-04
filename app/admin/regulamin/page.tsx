import { getStatute } from "@/app/lib/oci";

import Navbar from "../components/Navbar";
import Regulamin from "./components/Regulamin";

export default async function Page() {
  const statute = await getStatute();
  return (
    <>
      <Navbar />
      <Regulamin statute={statute} />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

import { getConfirmation } from "@/app/lib/oci";

import Navbar from "../components/Navbar";
import Bierzmowanie from "./components/Bierzmowanie";

export default async function Page() {
  const statute = await getConfirmation();
  return (
    <>
      <Navbar />
      <Bierzmowanie statute={statute} />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

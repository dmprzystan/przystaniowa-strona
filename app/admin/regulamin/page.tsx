import { readFile } from "@/app/lib/b2";

import Navbar from "../components/Navbar";
import Regulamin from "./components/Regulamin";

export default async function Page() {
  const statute = await readFile("regulamin/regulamin.html");
  return (
    <>
      <Navbar />
      <Regulamin statute={statute} />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

import { getNewspapers } from "@/app/lib/prisma";
import Navbar from "../components/Navbar";
import Gazetka from "./components/Gazetka";

export default async function Page() {
  const newspapers = await getNewspapers();

  return (
    <>
      <Navbar />
      <Gazetka newspapers={newspapers} />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

import Navbar from "../components/Navbar";
import Galeria from "./components/Galeria";

import { getGallery } from "@/app/lib/prisma";

export default async function Plan() {
  const gallery = await getGallery();
  return (
    <>
      <Navbar />
      <Galeria gallery={gallery} />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

import Navbar from "@/app/admin/components/Navbar";

import Album from "./components/Album";
import { getAlbum } from "@/app/lib/prisma";

export default async function Plan({ params }: { params: { id: string } }) {
  const album = await getAlbum(params.id);
  return (
    <>
      <Navbar />
      <Album album={album} />
    </>
  );
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

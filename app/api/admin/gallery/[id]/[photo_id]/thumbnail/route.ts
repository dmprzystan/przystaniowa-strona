import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/app/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; photo_id: string } }
) {
  const { id, photo_id } = params;

  await prisma.album.update({
    where: {
      id,
    },
    data: {
      thumbnail: {
        connect: {
          id: photo_id,
        },
      },
    },
  });

  revalidatePath(`/galeria/${id}`);

  return NextResponse.json({ message: "ok" });
}

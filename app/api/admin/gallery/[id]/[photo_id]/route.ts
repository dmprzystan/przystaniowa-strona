import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma, { type AlbumPhotoSize } from "@/app/lib/prisma";

import { deleteFile } from "@/app/lib/b2";

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string; photo_id: string }> }
) {
  const params = await props.params;
  const { id, photo_id } = params;

  const photo = await prisma.albumPhoto.findUnique({
    where: {
      id: photo_id,
    },
  });

  if (!photo) {
    return NextResponse.json({ message: "Photo not found" }, { status: 404 });
  }

  const data = await req.json();
  const size = data["size"] as AlbumPhotoSize;

  if (!size || !["NORMAL", "WIDE", "TALL", "BIG"].includes(size)) {
    return NextResponse.json({ message: "Invalid size" }, { status: 400 });
  }

  await prisma.albumPhoto.update({
    where: {
      id: photo_id,
    },
    data: {
      size,
    },
  });

  revalidatePath(`/galeria`);
  revalidatePath(`/galeria/${id}`);

  return NextResponse.json({ message: "ok" }, { status: 200 });
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ id: string; photo_id: string }> }
) {
  const params = await props.params;
  const { id, photo_id } = params;

  const photo = await prisma.albumPhoto.delete({
    where: {
      id: photo_id,
    },
  });

  if (!photo) {
    return NextResponse.json({ message: "Photo not found" }, { status: 404 });
  }

  await deleteFile(photo.url);

  revalidatePath(`/galeria`);
  revalidatePath(`/galeria/${id}`);

  return NextResponse.json({ message: "ok" }, { status: 200 });
}

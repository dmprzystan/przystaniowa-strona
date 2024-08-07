import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getNamespace } from "@/app/lib/oci";
import prisma, { type AlbumPhotoSize } from "@/app/lib/prisma";
import { ObjectStorageClient } from "@/app/lib/oci";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; photo_id: string } }
) {
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
  { params }: { params: { id: string; photo_id: string } }
) {
  const { id, photo_id } = params;

  const photo = await prisma.albumPhoto.findUnique({
    where: {
      id: photo_id,
    },
  });

  if (!photo) {
    return NextResponse.json({ message: "Photo not found" }, { status: 404 });
  }

  const namespaceName = await getNamespace();
  const objectPath = "gallery";
  const objectName = `${objectPath}/${photo.url}`;

  const deleteDB = prisma.albumPhoto.delete({
    where: {
      id: photo_id,
    },
  });

  const deleteImage = ObjectStorageClient.deleteObject({
    bucketName: "przystaniowa-strona",
    namespaceName,
    objectName,
  });

  const deletePrevew = ObjectStorageClient.deleteObject({
    bucketName: "przystaniowa-strona",
    namespaceName,
    objectName: `${objectPath}/${photo.preview}`,
  });

  await Promise.all([deleteDB, deleteImage, deletePrevew]);

  revalidatePath(`/galeria`);
  revalidatePath(`/galeria/${id}`);

  return NextResponse.json({ message: "ok" }, { status: 200 });
}

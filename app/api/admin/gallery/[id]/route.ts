import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getNamespace } from "@/app/lib/oci";
import { v7 } from "uuid";
import prisma, { AlbumPhotoSize } from "@/app/lib/prisma";
import { ObjectStorageClient } from "@/app/lib/oci";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const album = await prisma.album.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      date: true,
      AlbumPhoto: {
        select: {
          id: true,
          url: true,
          size: true,
        },
      },
    },
  });

  if (!album) {
    return NextResponse.json({ message: "Album not found" }, { status: 404 });
  }

  return NextResponse.json({ album });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const album = await prisma.album.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      AlbumPhoto: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });

  if (!album) {
    return NextResponse.json({ message: "Album not found" }, { status: 404 });
  }

  const deleteDB = prisma.albumPhoto.deleteMany({
    where: {
      albumId: id,
    },
  });

  const namespaceName = await getNamespace();

  const deleteAlbum = album.AlbumPhoto.map((photo) => {
    return ObjectStorageClient.deleteObject({
      bucketName: "przystaniowa-strona",
      namespaceName: namespaceName,
      objectName: `gallery/${photo.url}`,
    });
  });

  await Promise.all(deleteAlbum);

  try {
    await deleteDB;
    await prisma.album.delete({
      where: {
        id,
      },
    });
    revalidatePath("/galeria");
    return NextResponse.json({ message: "ok" });
  } catch (e) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log(id);

  const data = await req.formData();
  const file = data.get("file");
  const size = data.get("size") as string;

  if (!file || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  const uuid = v7();

  const namespaceName = await getNamespace();
  const objectPath = "gallery";
  const uniqueName = `${id}/galeria-${uuid}.${file.name.split(".").pop()}`;

  const objectName = `${objectPath}/${uniqueName}`;

  let s: AlbumPhotoSize = "NORMAL";

  // Check if the size is valid
  if (size && ["NORMAL", "WIDE", "TALL", "BIG"].includes(size)) {
    s = size as AlbumPhotoSize;
  }

  await prisma.albumPhoto.create({
    data: {
      albumId: id,
      url: uniqueName,
      size: s,
    },
  });

  await ObjectStorageClient.putObject({
    bucketName: "przystaniowa-strona",
    namespaceName,
    objectName,
    putObjectBody: file.stream(),
  });

  revalidatePath("/galeria");
  revalidatePath(`/galeria/${id}`);

  return NextResponse.json({ message: "ok" });
}

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getNamespace } from "@/app/lib/oci";
import { v7 } from "uuid";
import prisma, { AlbumPhotoSize, getAlbum } from "@/app/lib/prisma";
import { ObjectStorageClient } from "@/app/lib/oci";
import sharp from "sharp";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const album = await getAlbum(id);

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

  const data = await req.json();

  const { title, date, description } = data;

  try {
    await prisma.album.update({
      where: {
        id,
      },
      data: {
        title,
        date: new Date(date),
        description,
      },
    });

    revalidatePath("/galeria");
    revalidatePath(`/galeria/${id}`);
    return NextResponse.json({ message: "ok" });
  } catch (e) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
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
      photos: {
        select: {
          id: true,
          url: true,
          preview: true,
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

  const deleteImages = album.photos.map((photo) => {
    return ObjectStorageClient.deleteObject({
      bucketName: "przystaniowa-strona",
      namespaceName: namespaceName,
      objectName: `gallery/${photo.url}`,
    });
  });

  const deletePreviews = album.photos.map((photo) => {
    return ObjectStorageClient.deleteObject({
      bucketName: "przystaniowa-strona",
      namespaceName: namespaceName,
      objectName: `gallery/${photo.preview}`,
    });
  });

  await Promise.all(deleteImages);
  await Promise.all(deletePreviews);

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
  const previewUniqueName = `${id}/preview-${uuid}.webp`;

  const objectName = `${objectPath}/${uniqueName}`;
  const previewObjectName = `${objectPath}/${previewUniqueName}`;

  let s: AlbumPhotoSize = "NORMAL";

  // Check if the size is valid
  if (size && ["NORMAL", "WIDE", "TALL", "BIG"].includes(size)) {
    s = size as AlbumPhotoSize;
  }

  const album = await getAlbum(id);

  if (!album) {
    return NextResponse.json({ message: "Album not found" }, { status: 404 });
  }

  const photo = await prisma.albumPhoto.create({
    data: {
      albumId: id,
      url: uniqueName,
      preview: previewUniqueName,
      size: s,
    },
  });

  if (album.thumbnail === null) {
    await prisma.album.update({
      where: {
        id,
      },
      data: {
        thumbnail: {
          connect: {
            id: photo.id,
          },
        },
      },
    });
  }

  await ObjectStorageClient.putObject({
    bucketName: "przystaniowa-strona",
    namespaceName,
    objectName,
    putObjectBody: file.stream(),
  });

  const imageReader = file.stream().getReader();
  const chunks = [];
  let done = false;
  while (!done) {
    const { value, done: d } = await imageReader.read();
    if (d) {
      done = true;
    } else {
      chunks.push(value);
    }
  }

  const buffer = Buffer.concat(chunks);

  let image = sharp(buffer);

  if (s === "NORMAL") {
    image = image.resize(300, 250);
  } else if (s === "WIDE") {
    image = image.resize(600, 250);
  } else if (s === "TALL") {
    image = image.resize(300, 500);
  } else if (s === "BIG") {
    image = image.resize(600, 500);
  }

  image.blur(1);
  image.toFormat("webp", {
    quality: 50,
  });

  image.toBuffer((err, data, info) => {
    if (err) {
      console.error(err);
      return;
    }

    ObjectStorageClient.putObject({
      bucketName: "przystaniowa-strona",
      namespaceName,
      objectName: previewObjectName,
      putObjectBody: data,
    });
  });

  revalidatePath("/galeria");
  revalidatePath(`/galeria/${id}`);

  return NextResponse.json({ message: "ok" });
}

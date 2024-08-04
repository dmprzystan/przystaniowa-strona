import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getNamespace } from "@/app/lib/oci";
import { v7 } from "uuid";
import prisma from "@/app/lib/prisma";
import { ObjectStorageClient } from "@/app/lib/oci";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log(id);

  const data = await req.formData();
  const file = data.get("file");

  if (!file || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  const uuid = v7();

  const namespaceName = await getNamespace();
  const objectName = `gallery/${id}/galeria-${uuid}.${file.name
    .split(".")
    .pop()}`;

  await prisma.albumPhoto.create({
    data: {
      albumId: id,
      url: objectName,
    },
  });

  await ObjectStorageClient.putObject({
    bucketName: "przystaniowa-strona",
    namespaceName,
    objectName,
    putObjectBody: file.stream(),
  });

  revalidatePath(`/galeria/${id}`);

  return NextResponse.json({ message: "ok" });
}

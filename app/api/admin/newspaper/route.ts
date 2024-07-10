import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import path from "path";
import * as oci from "oci-sdk";
import { ObjectStorageClient, getNamespace } from "@/app/lib/oci";

const months = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const title = data.get("title") as string;
  const date = data.get("date") as string;
  const file = data.get("file") as File;

  if (!title || !date || !file || !file.name) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return NextResponse.json({ message: "Invalid date" }, { status: 400 });
  }

  const dateStr = `${
    months[parsedDate.getMonth()]
  } ${parsedDate.getFullYear()}`;

  const name = `Gazetka 19tka ${title} (${dateStr}).pdf`;

  // Get the namespace
  const namespaceName = await getNamespace();

  // Upload the file
  const putObjectRequest: oci.objectstorage.requests.PutObjectRequest = {
    bucketName: "przystaniowa-strona",
    namespaceName: namespaceName,
    objectName: name,
    putObjectBody: file.stream(),
  };

  await ObjectStorageClient.putObject(putObjectRequest);

  await prisma.newspaper.create({
    data: {
      title,
      date: parsedDate,
      url: name,
    },
  });

  revalidatePath("/gazetka");

  return NextResponse.json({ message: "ok" });
}

export async function GET(req: NextRequest) {
  const newspapers = await prisma.newspaper.findMany();
  return NextResponse.json(newspapers);
}

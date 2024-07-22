import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import * as oci from "oci-sdk";
import { ObjectStorageClient, getNamespace } from "@/app/lib/oci";

export async function POST(req: NextRequest) {
  const data = await req.formData();

  const title = data.get("title") as string;
  const dateStart = data.get("dateStart") as string;
  const dateEnd = data.get("dateEnd") as string;
  const description = data.get("description") as string;

  if (!title || !dateStart || !dateEnd || !description) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const parsedDateStart = new Date(dateStart);
  const parsedDateEnd = new Date(dateEnd);

  if (isNaN(parsedDateStart.getTime()) || isNaN(parsedDateEnd.getTime())) {
    return NextResponse.json({ message: "Invalid date" }, { status: 400 });
  }

  if (parsedDateStart > parsedDateEnd) {
    return NextResponse.json(
      { message: "Invalid date range" },
      { status: 400 }
    );
  }

  const trip = await prisma.trip.create({
    data: {
      title,
      dateStart: parsedDateStart,
      dateEnd: parsedDateEnd,
      description,
    },
  });

  const image = data.get("image") as File | undefined;

  if (image) {
    const namespaceName = await getNamespace();
    const name = `trip-${trip.id}.jpg`;

    const putObjectRequest: oci.objectstorage.requests.PutObjectRequest = {
      bucketName: "przystaniowa-strona",
      namespaceName,
      objectName: name,
      putObjectBody: image.stream(),
    };

    await ObjectStorageClient.putObject(putObjectRequest);

    await prisma.tripPhoto.create({
      data: {
        url: name,
        tripId: trip.id,
      },
    });
  }

  const attachments = data.getAll("attachments") as File[];

  for (const attachment of attachments) {
    const namespaceName = await getNamespace();
    const name = `trip-${trip.id}-${attachment.name}`;

    const putObjectRequest: oci.objectstorage.requests.PutObjectRequest = {
      bucketName: "przystaniowa-strona",
      namespaceName,
      objectName: name,
      putObjectBody: attachment.stream(),
    };

    await ObjectStorageClient.putObject(putObjectRequest);

    await prisma.tripAttachment.create({
      data: {
        url: name,
        tripId: trip.id,
        name: attachment.name,
      },
    });
  }

  const links = data.getAll("links") as string[];
  for (const link of links) {
    const parsedLink = JSON.parse(link) as { url: string; name: string };

    await prisma.tripLink.create({
      data: {
        url: parsedLink.url,
        name: parsedLink.name,
        tripId: trip.id,
      },
    });
  }

  revalidatePath("/wyjazdy");

  return NextResponse.json({ message: "ok" });
}

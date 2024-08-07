import prisma, { getTrips } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/app/lib/oci";

export async function GET(_req: NextRequest) {
  const trips = await getTrips();

  return NextResponse.json(trips);
}

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
    const extension = image.name.split(".").pop();

    await uploadFile(image, `wyjazdy/${trip.id}/zdjecie.${extension}`);

    await prisma.tripPhoto.create({
      data: {
        url: `${trip.id}/zdjecie.${extension}`,
        tripId: trip.id,
      },
    });
  }

  const attachments = data.getAll("attachments") as File[];

  for (const attachment of attachments) {
    await uploadFile(attachment, `wyjazdy/${trip.id}/${attachment.name}`);

    await prisma.tripAttachment.create({
      data: {
        url: `${trip.id}/${attachment.name}`,
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

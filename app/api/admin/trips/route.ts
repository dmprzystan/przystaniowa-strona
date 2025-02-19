import prisma, { getTrips } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createPresignedUrl } from "@/app/lib/b2";

export async function GET(_req: NextRequest) {
  const trips = await getTrips();

  return NextResponse.json(trips);
}

const NewTripSchema = z.object({
  title: z.string().min(1, { message: "Tytuł jest wymagany" }),
  dateStart: z.coerce.date({ message: "Nieprawidłowa data rozpoczęcia" }),
  dateEnd: z.coerce.date({ message: "Nieprawidłowa data zakończenia" }),
  description: z.string(),
  image: z.string(), // Image name
  attachments: z.array(
    z.object({
      name: z.string(),
      ext: z.string(),
    })
  ),
  links: z.array(
    z.object({
      url: z.string(),
      name: z.string(),
    })
  ),
});

export async function POST(req: NextRequest) {
  const data = await req.json();

  const parse = NewTripSchema.safeParse(data);

  if (!parse.success) {
    const message = parse.error.errors.map((error) => error.message).join(", ");
    return NextResponse.json({ message }, { status: 400 });
  }

  const { title, dateStart, dateEnd, description, image, attachments, links } =
    parse.data;

  if (dateStart > dateEnd) {
    return NextResponse.json(
      { message: "Data zakończenia nie może być przed datą rozpoczęcia" },
      { status: 400 }
    );
  }

  const trip = await prisma.trip.create({
    data: {
      title,
      dateStart,
      dateEnd,
      description,
    },
  });

  if (image) {
    await prisma.trip.update({
      where: { id: trip.id },
      data: {
        thumbnail: `wyjazdy/${trip.id}/${image}`,
      },
    });
  }

  const linkPromise = prisma.tripLink.createMany({
    data: links.map((link) => {
      return {
        tripId: trip.id,
        name: link.name,
        url: link.url,
      };
    }),
  });

  const attachmentPromise = prisma.tripAttachment.createMany({
    data: attachments.map((attachment) => {
      return {
        tripId: trip.id,
        name: attachment.name,
        url: `wyjazdy/${trip.id}/attachments/${attachment.name}.${attachment.ext}`,
      };
    }),
  });

  await Promise.all([linkPromise, attachmentPromise]);

  // Create the PARs
  let imagePAR = image
    ? await createPresignedUrl(`wyjazdy/${trip.id}/${image}`)
    : null;

  const attachmentPARs = await Promise.all(
    attachments.map(async (attachment) => {
      return {
        name: attachment.name,
        url: await createPresignedUrl(
          `wyjazdy/${trip.id}/attachments/${attachment.name}.${attachment.ext}`
        ),
      };
    })
  );

  revalidatePath("/wyjazdy");

  return NextResponse.json({
    message: "ok",
    id: trip.id,
    imagePAR,
    attachmentPARs,
  });
}

import prisma, { getTrips } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createPAR, removeExpiredPARs } from "@/app/lib/oci";
import { z } from "zod";

export async function GET(_req: NextRequest) {
  const trips = await getTrips();

  return NextResponse.json(trips);
}

const NewTripSchema = z.object({
  title: z.string().min(1, { message: "Tytuł jest wymagany" }),
  dateStart: z.coerce.date({ message: "Nieprawidłowa data rozpoczęcia" }),
  dateEnd: z.coerce.date({ message: "Nieprawidłowa data zakończenia" }),
  description: z.string(),
  photoExt: z
    .string()
    .min(1, { message: "Rozszerzenie zdjęcia jest wymagane" }),
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

  const {
    title,
    dateStart,
    dateEnd,
    description,
    photoExt,
    attachments,
    links,
  } = parse.data;

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

  const linkPromise = prisma.tripLink.createMany({
    data: links.map((link) => {
      return {
        tripId: trip.id,
        name: link.name,
        url: link.url,
      };
    }),
  });

  const photoPromise = prisma.tripPhoto.create({
    data: {
      url: `zdjecie.${photoExt}`,
      tripId: trip.id,
    },
  });

  const attachmentPromise = prisma.tripAttachment.createMany({
    data: attachments.map((attachment) => {
      return {
        tripId: trip.id,
        name: attachment.name,
        url: `${attachment.name}.${attachment.ext}`,
      };
    }),
  });

  await Promise.all([linkPromise, photoPromise, attachmentPromise]);

  // Create PARs for the photo and attachments
  const photoPar = await createPAR(`wyjazdy/${trip.id}/zdjecie.${photoExt}`);
  const attachmentPAR = await createPAR(
    `wyjazdy/${trip.id}/attachments/`,
    true
  );

  await removeExpiredPARs();

  revalidatePath("/wyjazdy");

  return NextResponse.json({
    message: "ok",
    id: trip.id,
    photoPar,
    attachmentPAR,
  });
}

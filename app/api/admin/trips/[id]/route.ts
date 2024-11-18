import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteFile } from "@/app/lib/oci";
import { z } from "zod";

async function promiseEach(arr: any[], fn: (item: any) => Promise<void>) {
  for (const item of arr) await fn(item);
}

const PatchSchema = z.object({
  title: z.string().min(1, { message: "Tytuł nie może być pusty" }).optional(),
  description: z.string().optional(),
  dateStart: z.coerce
    .date({ message: "Nieprawidłowa data rozpoczęcia" })
    .optional(),
  dateEnd: z.coerce
    .date({ message: "Nieprawidłowa data zakończenia" })
    .optional(),
  links: z
    .array(
      z.object({
        url: z.string(),
        name: z.string(),
      })
    )
    .optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const trip = await prisma.trip.findUnique({
    where: {
      id: id as string,
    },
    include: {
      TripPhoto: true,
      TripAttachment: true,
      TripLink: true,
    },
  });

  if (!trip) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(trip);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await req.json();

  const parse = PatchSchema.safeParse(data);

  if (!parse.success) {
    const message = parse.error.errors.map((error) => error.message).join(", ");
    return NextResponse.json({ message }, { status: 400 });
  }

  const trip = await prisma.trip.findUnique({
    where: {
      id: id as string,
    },
    include: {
      TripPhoto: true,
      TripAttachment: true,
      TripLink: true,
    },
  });

  if (!trip) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const { title, description, dateStart, dateEnd, links } = parse.data;

  if (dateStart && dateEnd && dateStart > dateEnd) {
    return NextResponse.json(
      { message: "Data zakończenia nie może być przed datą rozpoczęcia" },
      { status: 400 }
    );
  }

  const updatedTrip = await prisma.trip.update({
    where: {
      id: id as string,
    },
    data: {
      title,
      description,
      dateStart,
      dateEnd,
      TripLink: links && {
        deleteMany: {},
        createMany: {
          data: links.map((link) => {
            return {
              name: link.name,
              url: link.url,
            };
          }),
        },
      },
    },
    include: {
      TripPhoto: true,
      TripAttachment: true,
      TripLink: true,
    },
  });

  revalidatePath("/wyjazdy");

  return NextResponse.json(updatedTrip);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const trip = await prisma.trip.findUnique({
    where: {
      id: id as string,
    },
    include: {
      TripPhoto: true,
      TripAttachment: true,
      TripLink: true,
    },
  });

  if (!trip) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.tripPhoto.deleteMany({
      where: {
        tripId: id as string,
      },
    }),
    prisma.tripAttachment.deleteMany({
      where: {
        tripId: id as string,
      },
    }),
    prisma.tripLink.deleteMany({
      where: {
        tripId: id as string,
      },
    }),
    prisma.trip.delete({
      where: {
        id: id as string,
      },
    }),
  ]);

  try {
    const promises = [];
    for (const photo of trip.TripPhoto) {
      promises.push(deleteFile(`wyjazdy/${trip.id}/${photo.url}`));
    }

    for (const attachment of trip.TripAttachment) {
      promises.push(deleteFile(`wyjazdy/${trip.id}/attachments/${attachment.url}`));
    }

    await promiseEach(promises, (promise) => promise);
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/wyjazdy");

  return NextResponse.json(trip);
}

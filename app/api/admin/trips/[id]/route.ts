import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteFile } from "@/app/lib/oci";

async function promiseEach(arr: any[], fn: (item: any) => Promise<void>) {
  for (const item of arr) await fn(item);
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
      promises.push(deleteFile(`wyjazdy/${trip.id}/${attachment.url}`));
    }

    await promiseEach(promises, (promise) => promise);
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/wyjazdy");

  return NextResponse.json(trip);
}

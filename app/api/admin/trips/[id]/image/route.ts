import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createPAR, deleteFile } from "@/app/lib/oci";
import { z } from "zod";

// Delete the trip photo
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

  // Remove the photo from the OCI
  await deleteFile(`wyjazdy/${id}/${trip.TripPhoto[0].url}`);

  await prisma.tripPhoto.deleteMany({
    where: {
      tripId: id as string,
    },
  });

  revalidatePath("/wyjazdy");

  return NextResponse.json({ message: "ko" });
}

const UpdatePhotoSchema = z.object({
  photoExt: z
    .string()
    .min(1, { message: "Rozszerzenie zdjęcia jest wymagane" }),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const trip = await prisma.trip.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!trip) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const data = await req.json();

  const parse = UpdatePhotoSchema.safeParse(data);

  if (!parse.success) {
    const message = parse.error.errors[0].message;
    return NextResponse.json({ message: message }, { status: 400 });
  }

  const { photoExt } = parse.data;

  await prisma.tripPhoto.deleteMany({
    where: {
      tripId: id as string,
    },
  });

  await prisma.tripPhoto.create({
    data: {
      tripId: id as string,
      url: `zdjecie.${photoExt}`,
    },
  });

  const photoPAR = await createPAR(`wyjazdy/${id}/zdjecie.${photoExt}`);

  revalidatePath("/wyjazdy");

  return NextResponse.json({ par: photoPAR });
}

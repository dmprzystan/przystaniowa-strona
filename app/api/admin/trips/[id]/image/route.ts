import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createPresignedUrl, deleteFile } from "@/app/lib/b2";
import { z } from "zod";
import prisma from "@/app/lib/prisma";

// Delete the trip photo
export async function DELETE(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const trip = await prisma.trip.update({
    where: {
      id: id as string,
    },
    data: {
      thumbnail: "",
    },
  });

  // Remove the photo from the OCI
  await deleteFile(trip.thumbnail);

  revalidatePath("/wyjazdy");

  return NextResponse.json({ message: "ko" });
}

const UpdatePhotoSchema = z.object({
  photoExt: z
    .string()
    .min(1, { message: "Rozszerzenie zdjęcia jest wymagane" }),
});

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

  await prisma.trip.update({
    where: {
      id: id as string,
    },
    data: {
      thumbnail: `wyjazdy/${id}/zdjecie.${photoExt}`,
    },
  });

  const photoPAR = await createPresignedUrl(
    `wyjazdy/${id}/zdjecie.${photoExt}`
  );

  revalidatePath("/wyjazdy");

  return NextResponse.json({ par: photoPAR });
}

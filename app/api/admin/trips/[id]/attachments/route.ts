import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createPresignedUrl } from "@/app/lib/b2";
import { z } from "zod";

const NewAttachmentSchema = z.object({
  name: z.string(),
  ext: z.string(),
});

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const data = await req.json();

  const parse = NewAttachmentSchema.safeParse(data);

  if (!parse.success) {
    const message = parse.error.errors.map((error) => error.message).join(", ");
    return NextResponse.json({ message }, { status: 400 });
  }

  const { name, ext } = parse.data;

  const trip = await prisma.trip.findUnique({
    where: {
      id: id as string,
    },
    include: {
      TripAttachment: true,
      TripLink: true,
    },
  });

  if (!trip) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await prisma.tripAttachment.create({
    data: {
      tripId: trip.id,
      name,
      url: `${name}.${ext}`,
    },
  });

  const par = await createPresignedUrl(
    `wyjazdy/${id}/attachments/${name}.${ext}`
  );

  revalidatePath("/wyjazdy");

  return NextResponse.json({ message: "ok", par });
}

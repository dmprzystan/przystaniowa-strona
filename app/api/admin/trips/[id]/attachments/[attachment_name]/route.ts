import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createPAR, deleteFile } from "@/app/lib/oci";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; attachment_name: string } }
) {
  const { id, attachment_name } = params;

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

  // Remove the attachment from the OCI
  const attachment = trip.TripAttachment.find(
    (a) => a.name === attachment_name
  );
  if (!attachment) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  console.log(`Deleting attachment ${attachment.url}`);

  await deleteFile(`wyjazdy/${id}/attachments/${attachment.url}`);
  await prisma.tripAttachment.delete({
    where: {
      id: attachment.id,
    },
  });

  revalidatePath("/wyjazdy");

  return NextResponse.json({ message: "ok" });
}

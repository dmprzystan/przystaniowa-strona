import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteFile } from "@/app/lib/b2";

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string; attachment_name: string }> }
) {
  const params = await props.params;
  const { id, attachment_name } = params;

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

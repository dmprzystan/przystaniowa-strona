import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/app/lib/prisma";

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const data = await req.json();

  const { title, url } = data;

  try {
    await prisma.confirmationLink.update({
      where: {
        id,
      },
      data: {
        title,
        url,
      },
    });

    revalidatePath("/bierzmowanie");
    return NextResponse.json({ message: "ok" });
  } catch (e) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  await prisma.confirmationLink.delete({
    where: {
      id,
    },
  });

  revalidatePath("/bierzmowanie");
  return NextResponse.json({ message: "ok" });
}

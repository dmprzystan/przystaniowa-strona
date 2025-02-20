"use server";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  await prisma.schedule.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");

  return NextResponse.json({ message: "DELETE" });
}

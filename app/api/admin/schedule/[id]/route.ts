"use server";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const r = await fetch("http://localhost:3000/api/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!r.ok) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await prisma.schedule.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");

  return NextResponse.json({ message: "DELETE" });
}

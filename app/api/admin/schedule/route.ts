"use server";

import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const schedule = await prisma.schedule.findMany();
  return NextResponse.json(schedule);
}

export async function POST(req: NextRequest) {
  const res = await req.json();
  const { title, time, day } = res;

  if (!title || !time || !day) {
    return NextResponse.json(
      { message: "Missing title, time or day" },
      { status: 400 }
    );
  }

  const schedule = await prisma.schedule.create({
    data: {
      title,
      time,
      day,
    },
  });

  revalidatePath("/");

  return NextResponse.json(schedule);
}

"use server";

import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  console.log(req.url);
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

  const token = req.cookies.get("token");

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

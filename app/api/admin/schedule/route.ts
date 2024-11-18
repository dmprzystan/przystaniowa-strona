"use server";

import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { object, string } from "zod";
import { Readable } from "@/app/lib/ZodError";

export async function GET(req: NextRequest) {
  const schedule = await prisma.schedule.findMany();
  return NextResponse.json(schedule);
}

export async function POST(req: NextRequest) {
  const timeRegex = new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$");
  const schema = object({
    title: string({
      required_error: "Tytuł jest wymagany",
      invalid_type_error: "Błędny format tytułu",
    }).min(1, {
      message: "Błędny format tytułu",
    }),
    time: string({
      required_error: "Godzina jest wymagana",
      invalid_type_error: "Błędny format czasu",
    }).regex(timeRegex, {
      message: "Błędny format czasu",
    }),
    day: string({
      required_error: "Dzień jest wymagany",
      invalid_type_error: "Błędny format dnia",
    }).min(1, {
      message: "Błędny format dnia",
    }),
  });

  const res = await req.json();

  const parse = schema.safeParse(res);

  if (!parse.success) {
    const message = Readable(parse.error);

    return NextResponse.json(
      {
        message,
      },
      { status: 400 }
    );
  }

  try {
    await prisma.schedule.create({
      data: {
        title: parse.data.title,
        time: parse.data.time,
        day: parse.data.day,
      },
    });
  } catch (e) {
    return NextResponse.json({
      message: "Wystąpił błąd podczas dodawania",
      status: 500,
    });
  }

  revalidatePath("/");

  return NextResponse.json({
    message: "Pomyślnie dodano",
  });
}

import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createPresignedUrl } from "@/app/lib/b2";

const months = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { title, date } = data;

  if (!title || !date) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return NextResponse.json({ message: "Invalid date" }, { status: 400 });
  }

  const dateStr = `${
    months[parsedDate.getMonth()]
  } ${parsedDate.getFullYear()}`;

  const name = `Gazetka 19tka nr. ${title} (${dateStr}).pdf`;
  const path = `gazetki/${name}`;

  const par = await createPresignedUrl(path);

  const newspaper = await prisma.newspaper.create({
    data: {
      title: title.toString(),
      date: parsedDate,
      url: path,
    },
  });

  revalidatePath("/gazetka");

  return NextResponse.json({ message: "ok", par, id: newspaper.id });
}

export async function GET(_req: NextRequest) {
  const newspapers = await prisma.newspaper.findMany();
  return NextResponse.json(newspapers);
}

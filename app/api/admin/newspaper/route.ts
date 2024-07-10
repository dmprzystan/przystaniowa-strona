import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import * as fs from "fs";
import path from "path";

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
  const uploadPath = path.join(process.cwd(), "public", "gazetka");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  const data = await req.formData();
  const title = data.get("title") as string;
  const date = data.get("date") as string;
  const file = data.get("file") as File;

  if (!title || !date || !file || !file.name) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return NextResponse.json({ message: "Invalid date" }, { status: 400 });
  }

  const dateStr = `${
    months[parsedDate.getMonth()]
  } ${parsedDate.getFullYear()}`;

  const name = `Gazetka 19tka ${title} (${dateStr}).pdf`;

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(uploadPath, name);
  fs.writeFileSync(filePath, fileBuffer);

  await prisma.newspaper.create({
    data: {
      title,
      date: parsedDate,
      url: name,
    },
  });

  revalidatePath("/gazetka");

  return NextResponse.json({ message: "ok" });
}

export async function GET(req: NextRequest) {
  const newspapers = await prisma.newspaper.findMany();
  return NextResponse.json(newspapers);
}

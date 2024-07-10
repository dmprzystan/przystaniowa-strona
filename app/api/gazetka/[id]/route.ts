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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

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

  const gazetka = await prisma.newspaper.delete({
    where: {
      id: id as string,
    },
  });

  const filePath = path.join(process.cwd(), "public", "gazetka", gazetka.url);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  revalidatePath("/gazetka");

  return NextResponse.json(gazetka);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

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

  const data = await req.formData();

  const title = data.get("title") as string;
  const date = data.get("date") as string;
  const file = data.get("file") as File;

  const oldGazetka = await prisma.newspaper.findUnique({
    where: {
      id,
    },
  });

  if (!oldGazetka) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return NextResponse.json({ message: "Invalid date" }, { status: 400 });
  }

  const dateStr = `${
    months[parsedDate.getMonth()]
  } ${parsedDate.getFullYear()}`;

  const name = `Gazetka 19tka ${title} (${dateStr}).pdf`;

  if (file.size > 0) {
    const filePath = path.join(
      process.cwd(),
      "public",
      "gazetka",
      oldGazetka.url
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const newFilePath = path.join(process.cwd(), "public", "gazetka", name);
    fs.writeFileSync(newFilePath, fileBuffer);
  } else {
    const filePath = path.join(
      process.cwd(),
      "public",
      "gazetka",
      oldGazetka.url
    );
    const newFilePath = path.join(process.cwd(), "public", "gazetka", name);

    if (filePath !== newFilePath) {
      fs.renameSync(filePath, newFilePath);
    }
  }

  await prisma.newspaper.update({
    where: {
      id,
    },
    data: {
      title,
      date: parsedDate,
      url: name,
    },
  });

  revalidatePath("/gazetka");

  return NextResponse.json({ message: "ok" });
}

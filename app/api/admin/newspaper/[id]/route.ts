import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteFile } from "@/app/lib/b2";

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

export async function DELETE(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const gazetka = await prisma.newspaper.delete({
    where: {
      id: id as string,
    },
  });

  try {
    await deleteFile(gazetka.url);
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/gazetka");

  return NextResponse.json(gazetka);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

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

  const name = `Gazetka 19tka nr. ${title} (${dateStr}).pdf`;

  // if (file.size > 0) {
  //   await deleteFile(`gazetki/${oldGazetka.url}`);
  //   await uploadFile(file, `gazetki/${name}`);
  // } else if (oldGazetka.url !== name) {
  //   await renameFile(`gazetki/${oldGazetka.url}`, `gazetki/${name}`);
  // }

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

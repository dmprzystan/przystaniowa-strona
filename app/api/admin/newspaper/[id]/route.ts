import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ObjectStorageClient, getNamespace } from "@/app/lib/oci";
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

  const gazetka = await prisma.newspaper.delete({
    where: {
      id: id as string,
    },
  });

  const namespaceName = await getNamespace();

  try {
    await ObjectStorageClient.deleteObject({
      bucketName: "przystaniowa-strona",
      namespaceName,
      objectName: gazetka.url,
    });
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/gazetka");

  return NextResponse.json(gazetka);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

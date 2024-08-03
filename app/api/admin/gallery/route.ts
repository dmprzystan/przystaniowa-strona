import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(_req: NextRequest) {
  const gallery = await prisma.album.findMany({
    orderBy: {
      date: "desc",
    },
    include: {
      AlbumPhoto: {
        take: 1,
      },
    },
  });

  return NextResponse.json(gallery);
}

export async function POST(req: NextRequest) {
  const data = (await req.json()) as {
    title: string;
    date: string;
    description: string;
  };

  const title = data.title;
  const date = new Date(data.date);
  const description = data.description;

  await prisma.album.create({
    data: {
      title,
      date,
      description,
    },
  });

  return NextResponse.json({ message: "ok" });
}

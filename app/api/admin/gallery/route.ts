import prisma, { getGallery } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const NewAlbumSchema = z.object({
  title: z.string().min(1, { message: "Tytuł jest wymagany" }),
  date: z.coerce.date(),
  description: z.string().optional(),
});

export async function GET(_req: NextRequest) {
  const gallery = await getGallery();

  return NextResponse.json(gallery);
}

export async function POST(req: NextRequest) {
  const data = NewAlbumSchema.safeParse(await req.json());

  if (!data.success) {
    return NextResponse.json(
      { message: data.error.errors[0].message },
      { status: 400 }
    );
  }

  const { title, date, description } = data.data;

  try {
    await prisma.album.create({
      data: {
        title,
        date,
        description: description || "",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }

  revalidatePath("/galeria");

  return NextResponse.json({ message: "ok" });
}

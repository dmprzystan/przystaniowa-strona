import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const { title, url } = data;

  if (!title || !url || typeof title !== "string" || typeof url !== "string") {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  try {
    await prisma.confirmationLink.create({
      data: {
        title,
        url,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }

  revalidatePath("/bierzmowanie");

  return NextResponse.json({ message: "OK" });
}

export async function GET(_req: NextRequest) {
  const links = await prisma.confirmationLink.findMany();
  return new NextResponse(JSON.stringify(links));
}

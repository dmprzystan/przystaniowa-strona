import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { z } from "zod";

export async function GET(_req: NextRequest) {
  const email = await prisma.messageEmail.findFirst();

  return NextResponse.json(email);
}

const EmailSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parse = EmailSchema.safeParse(data);

  if (!parse.success) {
    return NextResponse.json(
      { error: "Nieprawidłowy adres email" },
      { status: 400 }
    );
  }

  await prisma.messageEmail.deleteMany();
  await prisma.messageEmail.create({ data: { email: parse.data.email } });

  return NextResponse.json({ status: "ok" });
}

import { NextRequest, NextResponse } from "next/server";
import prisma, { getConfig } from "@/app/lib/prisma";
import { z } from "zod";

export async function GET(_req: NextRequest) {
  const email = await getConfig("email");

  return NextResponse.json({ email: email?.value });
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

  await prisma.config.upsert({
    where: { key: "email" },
    update: { value: parse.data.email },
    create: { key: "email", value: parse.data.email },
  });

  return NextResponse.json({ status: "ok" });
}

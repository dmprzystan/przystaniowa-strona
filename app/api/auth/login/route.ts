import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const LoginSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  const parse = LoginSchema.safeParse(data);

  if (!parse.success) {
    return NextResponse.json({ error: "Błędne dane" }, { status: 400 });
  }

  const { login, password } = parse.data;

  const user = await prisma.user.findUnique({
    where: {
      login,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Błędny login albo hasło" },
      { status: 401 }
    );
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Błędny login albo hasło" },
      { status: 401 }
    );
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  const response = NextResponse.json({ status: "ok" });

  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
};

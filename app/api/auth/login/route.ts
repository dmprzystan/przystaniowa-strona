import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
  const { login, password } = (await req.json()) as {
    login: string;
    password: string;
  };

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

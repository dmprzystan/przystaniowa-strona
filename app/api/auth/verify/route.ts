import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
  try {
    const { token } = (await req.json()) as {
      token: string;
    };

    console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    if (!decoded.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ status: "ok" });
  } catch (e) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
};

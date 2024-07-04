"use server";

import { revalidatePath } from "next/cache";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  //   const { path, secret } = req.nextUrl;
  const path = req.nextUrl.searchParams.get("path");
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REFRESH_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (typeof path !== "string") {
    return NextResponse.json({ message: "Invalid path" }, { status: 400 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

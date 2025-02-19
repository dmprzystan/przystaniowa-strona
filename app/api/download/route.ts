import { NextRequest, NextResponse } from "next/server";
import { getDownloadUrl } from "@/app/lib/b2";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  const token = req.headers.get("authorization");

  if (!path || !token) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  if (token !== process.env.B2_DOWNLOAD_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { url, authorization } = await getDownloadUrl(path);

  return new NextResponse(JSON.stringify({ url, authorization }));
}

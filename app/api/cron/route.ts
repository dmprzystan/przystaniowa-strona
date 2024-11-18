import { removeExpiredPARs } from "@/app/lib/oci";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await removeExpiredPARs();

  return NextResponse.json({ ok: true });
}

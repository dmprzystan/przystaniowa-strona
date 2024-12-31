import { NextRequest, NextResponse } from "next/server";
import { getBucketSize } from "@/app/lib/b2";

export async function GET(_req: NextRequest) {
  const storage = await getBucketSize();

  return NextResponse.json({ storage });
}

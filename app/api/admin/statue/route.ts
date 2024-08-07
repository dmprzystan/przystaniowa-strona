import { NextResponse, type NextRequest } from "next/server";
import { putStatute, getStatute } from "@/app/lib/oci";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest) {
  const data = await req.json();

  const { statute } = data;

  if (!statute || typeof statute !== "string") {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  try {
    // await putStatute(statute);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }

  revalidatePath("/regulamin");

  return NextResponse.json({ message: "OK" });
}

export async function GET(_req: NextRequest) {
  const statute = await getStatute();
  return new NextResponse(statute);
}

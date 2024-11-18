import { NextResponse, type NextRequest } from "next/server";
import { getConfirmation, putConfirmation } from "@/app/lib/oci";
import { revalidatePath } from "next/cache";

export async function PATCH(req: NextRequest) {
  const data = await req.json();

  const { confirmation } = data;

  if (!confirmation || typeof confirmation !== "string") {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  try {
    await putConfirmation(confirmation);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }

  revalidatePath("/bierzmowanie");

  return NextResponse.json({ message: "OK" });
}

export async function GET(_req: NextRequest) {
  const statute = await getConfirmation();
  return new NextResponse(statute);
}

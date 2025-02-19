import { NextResponse, type NextRequest } from "next/server";
import { readFile, writeFile } from "@/app/lib/b2";
import { revalidatePath } from "next/cache";

export async function PATCH(req: NextRequest) {
  const data = await req.json();

  const { statute } = data;

  if (!statute || typeof statute !== "string") {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  try {
    await writeFile("regulamin/regulamin.html", statute);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }

  revalidatePath("/regulamin");

  return NextResponse.json({ message: "OK" });
}

export async function GET(_req: NextRequest) {
  const statute = await readFile("regulamin/regulamin.html");
  return new NextResponse(statute);
}

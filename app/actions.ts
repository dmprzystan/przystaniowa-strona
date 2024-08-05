"use server";

import { z } from "zod";

export async function submitMessage(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const schema = z.object({
    name: z.string().min(1),
    surname: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(1),
  });

  const parse = schema.safeParse({
    name: formData.get("name"),
    surname: formData.get("surname"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parse.success) {
    return { message: "Nie wszystkie wymagane pola zostały wypełnione" };
  }

  const data = parse.data;

  return { message: "Wiadomość wysłana" };
}

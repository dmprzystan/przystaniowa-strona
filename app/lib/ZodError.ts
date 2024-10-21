import { ZodError } from "zod";

export function Readable(error: ZodError) {
  const message = error.issues.map((issue) => issue.message).join(", ");

  return message;
}

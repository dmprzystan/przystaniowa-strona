"use server";

import { z } from "zod";
import { Resend } from "resend";
import { EmailTemplate } from "./email/EmailTemplate";

const resend = new Resend(process.env.RESNED_API_KEY);

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
    captcha: z.string().min(1),
  });

  const parse = schema.safeParse({
    name: formData.get("name"),
    surname: formData.get("surname"),
    email: formData.get("email"),
    message: formData.get("message"),
    captcha: formData.get("cf-turnstile-response"),
  });

  if (!parse.success) {
    return { message: "Nie wszystkie wymagane pola zostały wypełnione" };
  }

  const contactData = parse.data;

  const captcha = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.PRIVATE_CAPTCHA_KEY}&response=${contactData.captcha}`,
    }
  );

  const captchaData = await captcha.json();

  if (!captchaData.success) {
    return { message: "Weryfikacja CAPTCHA nie powiodła się" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Przystan <no-reply@przystan.dkomeza.com>",
      to: process.env.CONTACT_EMAIL!,
      subject: "Nowa wiadomość",
      react: EmailTemplate({ ...contactData }),
    });

    if (error) {
      return { message: "Wystąpił błąd podczas wysyłania wiadomości" };
    }


    return { message: "Wiadomość wysłana" };
  } catch (error) {
    return { message: "Wystąpił błąd podczas wysyłania wiadomości" };
  }
}

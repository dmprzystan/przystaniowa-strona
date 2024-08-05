"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus, useFormState } from "react-dom";
import Input from "./Input";
import TextArea from "./TextArea";

import { submitMessage } from "@/app/actions";
import {
  CheckCircleRounded,
  CloseRounded,
  ErrorRounded,
} from "@mui/icons-material";

const initialState = {
  message: "",
};

function Button({
  mobile,
  onClick,
}: {
  mobile?: boolean;
  onClick: () => void;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      onClick={onClick}
      className={`
        ${mobile ? "block sm:hidden" : "hidden sm:block"}
        bg-white rounded-full shadow-arround text-[#525252] uppercase py-2 mt-4 w-full disabled:opacity-50`}
      type="button"
      disabled={pending}
    >
      wyślij
    </button>
  );
}

function ContactForm() {
  const [state, submitForm] = useFormState(submitMessage, initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const captchaRef = useRef(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (state.message === "Wiadomość wysłana") {
      setError("");
      setSuccess("Wiadomość wysłana");
      setTimeout(() => {
        setSuccess("");
        state.message = "";
      }, 5000);
    } else if (state.message) {
      setSuccess("");
      setError(state.message);
      setTimeout(() => {
        setError("");
        state.message = "";
      }, 5000);
    }
  }, [state.message]);

  function handleSubmit() {
    // @ts-ignore
    grecaptcha.ready(function () {
      // @ts-ignore
      grecaptcha
        .execute(process.env.NEXT_PUBLIC_CAPTCHA_KEY, { action: "submit" })
        .then(function (token: any) {
          if (captchaRef.current) {
            // @ts-ignore
            captchaRef.current.value = token;
          }
          if (submitRef.current) {
            submitRef.current.click();
          }
        });
    });
  }

  return (
    <form
      className="w-full mt-4 xl:mt-10 py-10 px-8 bg-[#D9D9D9] flex flex-col sm:flex-row rounded-xl sm:gap-8 lg:w-[800px] mx-auto"
      action={submitForm}
    >
      <div className="flex flex-col gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-stretch flex-1">
        <Input label="IMIĘ" name="name" required type="text" />
        <Input label="NAZWISKO" name="surname" required type="text" />
        <Input label="TWÓJ E-MAIL" name="email" required={false} type="email" />
        <input
          type="text"
          name="captcha"
          id="captcha"
          className="hidden"
          ref={captchaRef}
          readOnly
        />
        <div className="w-full relative">
          {success && (
            <div className="rounded-xl bg-gradient-to-b from-green-300 to-green-50 border-[3px] border-white flex items-start gap-4 px-2 py-3 absolute w-full bottom-full shadow-arround">
              <div className="bg-white rounded-full px-2 py-2 shadow-md">
                <CheckCircleRounded className="text-green-500" />
              </div>
              <div>
                <p className="text-xl font-semibold">{success}</p>
              </div>
              <button
                className="ml-auto"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSuccess("");
                }}
              >
                <CloseRounded />
              </button>
            </div>
          )}
          {error && (
            <div className="rounded-xl bg-gradient-to-b from-red-300 to-red-50 border-[3px] border-white flex items-start gap-4 px-2 py-3 absolute w-full bottom-full shadow-arround">
              <div className="bg-white rounded-full px-2 py-2 shadow-md">
                <ErrorRounded className="text-red-500" />
              </div>
              <div>
                <p className="text-xl font-semibold">Wystąpił błąd</p>
                <p>{error}</p>
              </div>
              <button
                className="ml-auto"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setError("");
                }}
              >
                <CloseRounded />
              </button>
            </div>
          )}
          <Button onClick={handleSubmit} />
        </div>
      </div>
      <TextArea label="TWOJA WIADOMOŚĆ" name="message" />
      <Button onClick={handleSubmit} mobile />
      <button className="hidden" type="submit" ref={submitRef} />
    </form>
  );
}

export default ContactForm;

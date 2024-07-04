"use client";

import React, { useRef } from "react";
import Input from "./Input";
import TextArea from "./TextArea";

function ContactForm() {
  return (
    <form
      className="w-full mt-4 xl:mt-10 py-10 px-8 bg-[#D9D9D9] flex flex-col sm:flex-row rounded-xl sm:gap-8 lg:w-[800px] mx-auto"
      method="POST"
    >
      <div className="flex flex-col gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-stretch flex-1">
        <Input label="IMIĘ" name="name" required type="text" />
        <Input label="NAZWISKO" name="surname" required type="text" />
        <Input label="TWÓJ E-MAIL" name="email" required type="email" />
        <button
          className="hidden sm:block bg-[#EAEAEA] rounded-full shadow-arround text-[#525252] uppercase py-2 mt-4"
          type="submit"
        >
          wyślij
        </button>
      </div>
      <TextArea label="TWOJA WIADOMOŚĆ" name="message" />
      <button
        className="bg-[#EAEAEA] rounded-full shadow-arround text-[#525252] uppercase py-2 mt-4 sm:hidden"
        type="submit"
      >
        wyślij
      </button>
    </form>
  );
}

export default ContactForm;

"use client";

import React from "react";

import Input from "@/app/components/Input";

function page() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const login = formData.get("login") as string;
    const password = formData.get("password") as string;

    if (!login || !password) {
      return;
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });

    if (response.ok) {
      window.location.href = "/admin";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-arround px-8 py-8 rounded-2xl">
        <h1 className="text-3xl text-center uppercase">Zaloguj się</h1>
        <form className="flex flex-col gap-2 mt-10" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-8">
            <Input label="login" name="login" type="text" required />
            <Input label="hasło" name="password" type="password" required />
          </div>
          <button
            className="bg-[#EAEAEA] rounded-full shadow-arround text-[#525252] uppercase py-2 mt-4"
            type="submit"
          >
            zaloguj się
          </button>
        </form>
      </div>
    </div>
  );
}

export default page;

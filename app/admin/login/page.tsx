"use client";

import React from "react";

import Input from "@/app/components/Input";

import { useMessage } from "@/app/admin/AdminContext";
import LoadingButton from "../components/LoadingButton";

function Page() {
  const { setMessage } = useMessage();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      return;
    }

    try {
      const data = await response.json();
      if (data.error) setMessage({ type: "error", message: data.error });
      else setMessage({ type: "error", message: "Wystąpił błąd" });
    } catch {
      setMessage({ type: "error", message: "Wystąpił błąd" });
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-white shadow-arround px-8 py-8 rounded-2xl">
        <h1 className="text-3xl text-center uppercase">Zaloguj się</h1>
        <form className="flex flex-col gap-2 mt-10" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-8">
            <Input label="login" name="login" type="text" required />
            <Input label="hasło" name="password" type="password" required />
          </div>
          <LoadingButton
            loading={loading}
            className="mt-4"
            color="text-[#525252]"
          >
            <button
              className="bg-[#EAEAEA] rounded-full shadow-arround text-[#525252] uppercase py-2 w-full"
              type="submit"
            >
              zaloguj się
            </button>
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}

export default Page;

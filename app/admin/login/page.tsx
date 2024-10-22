"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  login: z.string().min(1, { message: "Login jest wymagany" }),
  password: z.string().min(1, { message: "Hasło jest wymagane" }),
});

function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTimeout, setErrorTimeout] = useState<Timer | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error);
      }

      window.location.href = "/admin";
    } catch (error: any) {
      setError(error.message);
      setErrorTimeout(
        setTimeout(() => {
          setError(null);
        }, 5000)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center flex-grow">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="pb-3 lg:pb-6">
          <CardTitle className="text-2xl lg:text-3xl">Logowanie</CardTitle>
          <CardDescription className="md:text-base">
            Zaloguj się do panelu administracyjnego
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="login"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={field.name}
                          className="text-muted-foreground font-normal ml-1"
                        >
                          Login
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="text-base !mt-0.5"
                            autoComplete="username"
                            required
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.login?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="text-muted-foreground font-normal ml-1"
                          htmlFor={field.name}
                        >
                          Hasło
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="text-base !mt-0.5"
                            type="password"
                            autoComplete="current-password"
                            required
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.password?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Błąd</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full mt-2 lg:mt-4"
                  disabled={loading}
                >
                  {loading && (
                    <div className="border-2 rounded-full border-s-transparent mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookmarkIcon, Pencil1Icon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  email: string | undefined;
};

function StronaGlowna(props: Props) {
  const [email, setEmail] = useState(props.email || "");

  const [editEmail, setEditEmail] = useState(props.email || "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditEmail(email);
  }, [email]);

  const saveEmail = async () => {
    setLoading(true);

    // Save email to the server
    try {
      const response = await fetch("/api/admin/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: editEmail,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error("Wystąpił błąd podczas zapisywania adresu e-mail");
    } finally {
      await fetchEmail();

      setLoading(false);
      setEditing(false);
    }
  };

  const fetchEmail = async () => {
    try {
      const response = await fetch("/api/admin/email");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const data = await response.json();

      setEmail(data.email);
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error("Wystąpił błąd podczas pobierania adresu e-mail");
    }
  };

  return (
    <div className="p-4">
      <div>
        <h1 className="text-3xl">Witaj w panelu administracyjnym</h1>
        <p className="mt-2">
          Tutaj możesz zarządzać treścią strony internetowej.
        </p>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 mt-4">
        <Card className="col-start-1 col-end-1">
          <CardHeader>
            <CardTitle>Adres korespondencyjny</CardTitle>
            <CardDescription>
              Adres e-mail na który będą wysyłane wiadomości z formularza
              kontaktowego.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              value={editEmail}
              onChange={(e) => {
                setEditEmail(e.target.value);
              }}
              disabled={!editing}
            />
            {editing ? (
              <Button size="icon" onClick={saveEmail} disabled={loading}>
                {loading ? (
                  <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
                ) : (
                  <BookmarkIcon />
                )}
              </Button>
            ) : (
              <Button
                size="icon"
                onClick={() => {
                  setEditing(true);
                }}
              >
                <Pencil1Icon />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StronaGlowna;

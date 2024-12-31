"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkIcon, Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";

export default function EmailTile() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [editEmail, setEditEmail] = useState(email);

  useEffect(() => {
    setEditEmail(email);
  }, [email]);

  useEffect(() => {
    fetchEmail().then(() => {
      setLoading(false);
    });
  }, []);

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

  const cancelEmail = () => {
    setEditEmail(email);
    setEditing(false);
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
    <Card className="">
      <CardHeader>
        <CardTitle>Adres korespondencyjny</CardTitle>
        <CardDescription>
          Adres e-mail na który będą wysyłane wiadomości z formularza
          kontaktowego.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        {loading ? (
          <Skeleton className="w-full h-[36px]" />
        ) : (
          <>
            <Input
              value={editEmail}
              onChange={(e) => {
                setEditEmail(e.target.value);
              }}
              disabled={!editing}
            />
            {editing ? (
              <div className="flex gap-2">
                <Button size="icon" onClick={cancelEmail} disabled={loading}>
                  {loading ? (
                    <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
                  ) : (
                    <Cross2Icon />
                  )}
                </Button>
                <Button size="icon" onClick={saveEmail} disabled={loading}>
                  {loading ? (
                    <div className="border-2 rounded-full border-s-transparent h-4 w-4 animate-spin" />
                  ) : (
                    <BookmarkIcon />
                  )}
                </Button>
              </div>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}

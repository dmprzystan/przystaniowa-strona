"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/app/bierzmowanie/style.scss";
import type { ConfirmationLink } from "@/app/lib/prisma";

import "@/app/bierzmowanie/style.scss";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { EditConfirmation, EditLinks } from "./EditForm";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Editor from "../../wyjazdy/add/components/Editor";

function Bierzmowanie(props: {
  confirmation: string;
  links: ConfirmationLink[];
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [staticHeight, setStaticHeight] = useState(9999);

  const [statute, setStatute] = useState(props.confirmation);
  const [links, setLinks] = useState(props.links);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(updateHeight, [links, bottomRef]);

  function updateHeight() {
    if (!bottomRef.current) return;

    const height = bottomRef.current.getBoundingClientRect().height;

    if (height > 0) {
      setStaticHeight(height);
    }

    console.log(height);
  }

  const updateConfirmation = async () => {
    const res = await fetch("/api/admin/confirmation", {
      cache: "no-cache",
    });

    if (!res.ok) {
      toast.error(
        "Nie udało się pobrać najnowszych danych, spróbuj odświeżyć stronę"
      );
      return;
    }

    const data = await res.text();
    setStatute(data);

    const resLinks = await fetch("/api/admin/confirmation/links", {
      cache: "no-cache",
    });

    if (!resLinks.ok) {
      toast.error(
        "Nie udało się pobrać najnowszych danych, spróbuj odświeżyć stronę"
      );
      return;
    }

    const linksData = await resLinks.json();
    setLinks(linksData);
  };

  return (
    <div className="px-4 w-full mt-4">
      <div
        className={`overflow-hidden ${
          isEditing ? "max-h-0" : "max-h-12"
        } transition-all duration-300`}
      >
        <h2 className="text-4xl mx-auto text-center">Bierzmowanie</h2>
      </div>
      <div className="mt-4 pb-8">
        <section>
          <div className="flex justify-between items-center px-4">
            <h3
              className={`text-2xl font-semibold ${
                isEditing ? "ml-8" : "ml-0"
              } transition-all duration-300`}
            >
              Opis
            </h3>
            {isEditing ? (
              <Button size="icon" onClick={() => setIsEditing(true)}>
                <BookmarkIcon />
              </Button>
            ) : (
              <Button size="icon" onClick={() => setIsEditing(true)}>
                <Pencil1Icon />
              </Button>
            )}
          </div>
          {isEditing ? (
            <>
              <Editor
                value={statute}
                setValue={() => {}}
                classname="bierzmowanie bg-dimmedBlue"
              />
            </>
          ) : (
            <div
              className="mt-4 bierzmowanie bg-dimmedBlue p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: statute }}
            />
          )}
        </section>
        <div
          className={`overflow-hidden transition-all duration-300 h-full`}
          style={{
            maxHeight: isEditing ? "0px" : `${staticHeight}px`,
          }}
          ref={bottomRef}
        >
          <Separator className="my-4" />
          <section>
            <div className="flex justify-between items-center px-4">
              <h3 className="text-2xl font-semibold">Linki</h3>
              <EditLinks links={links} update={updateConfirmation} />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch w-fit mx-auto gap-6 mt-6 md:text-lg lg:text-2xl xl:text-3xl uppercase">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="block bg-[#D9D9D9] px-8 lg:px-10 py-3 lg:py-4 rounded-xl shadow-lg text-center"
                >
                  {link.title}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Bierzmowanie;

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
import Head from "next/head";

function Bierzmowanie(props: {
  confirmation: string;
  links: ConfirmationLink[];
}) {
  const [confirmation, setConfirmation] = useState(props.confirmation);
  const [links, setLinks] = useState(props.links);

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
    setConfirmation(data);

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
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
        />
      </Head>
      <div className="p-4 w-full">
        <h2 className="text-4xl mx-auto text-center">Bierzmowanie</h2>
        <div className="mt-4 pb-8">
          <section className="flex flex-col">
            <EditConfirmation
              confirmation={confirmation}
              update={updateConfirmation}
            />
          </section>
          <div
            className={`overflow-hidden transition-all duration-300 h-full pb-4`}
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
    </>
  );
}

export default Bierzmowanie;

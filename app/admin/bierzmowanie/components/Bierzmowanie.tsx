"use client";

import React, { useState } from "react";
import Editor from "../../wyjazdy/add/components/Editor";
import type { ConfirmationLink } from "@/app/lib/prisma";

import "@/app/bierzmowanie/style.scss";
import { useMessage } from "../../AdminContext";
import { Separator } from "@/components/ui/separator";
import Input from "@/app/components/Input";
import { Button } from "@/components/ui/button";

function Bierzmowanie(props: {
  confirmation: string;
  links: ConfirmationLink[];
}) {
  const [statute, setStatute] = useState(props.confirmation);
  const [lastSaved, setLastSaved] = useState(props.confirmation);

  const { addToast } = useMessage();

  const [isEditing, setIsEditing] = useState(false);

  const save = async () => {
    setLastSaved(statute);
    setIsEditing(false);

    const response = await fetch("/api/admin/confirmation", {
      method: "PATCH",
      body: JSON.stringify({ statute }),
    });

    if (response.ok) {
      addToast({
        type: "success",
        message: "Pomyśnie zapisano zmiany",
      });
    } else {
      addToast({
        type: "error",
        message: "Błąd podczas zapisywania zmian",
      });
    }

    fetch("/api/admin/confirmation", {
      cache: "no-cache",
    }).then(async (response) => {
      if (response.ok) {
        const statute = await response.text();
        setStatute(statute);
        setLastSaved(statute);
      }
    });
  };
  const discard = () => {
    setStatute(lastSaved);
    setIsEditing(false);
  };

  return (
    <div className="px-4 sm:px-16 w-full mt-4 md:mt-0">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl sm:text-4xl text-center">Bierzmowanie</h2>
        {isEditing ? (
          <div className="flex gap-4">
            <button
              className="bg-red-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
              onClick={discard}
            >
              Anuluj
            </button>
            <button
              className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
              onClick={save}
            >
              Zapisz
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
            onClick={() => setIsEditing(true)}
          >
            Edytuj
          </button>
        )}
      </div>
      <div className="mt-4 sm:mt-16 bg-dimmedBlue sm:px-4 py-4 sm:py-8 rounded-xl">
        {isEditing ? (
          <Editor
            value={statute}
            setValue={setStatute}
            classname="bierzmowanie"
          />
        ) : (
          <div
            className="bierzmowanie mt-4"
            dangerouslySetInnerHTML={{ __html: statute }}
          />
        )}
        <Separator className="h-[2px] my-4" />
        <div className="flex flex-col items-center">
          <h3 className="text-xl sm:text-2xl text-white font-semibold">
            Linki
            {isEditing && (
              <div>
                <form
                  className="text-black flex flex-col gap-4 bg-neutral-50 px-4 py-2 pt-8 rounded-lg w-[600px]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const title = formData.get("title") as string;
                    const link = formData.get("link") as string;

                    fetch("/api/admin/confirmation/links", {
                      method: "POST",
                      body: JSON.stringify({ title, url: link }),
                    }).then(async (response) => {
                      if (response.ok) {
                        addToast({
                          type: "success",
                          message: "Pomyślnie dodano link",
                        });
                        const links = await fetch(
                          "/api/admin/confirmation/links"
                        ).then((response) => response.json());
                        console.log(links);
                      } else {
                        addToast({
                          type: "error",
                          message: "Błąd podczas dodawania linku",
                        });
                      }
                    });
                  }}
                >
                  <Input type="text" name="title" label="Tytuł" required />
                  <div></div>
                  <Input type="url" name="link" label="Adres" required />
                  <Button type="submit">Dodaj</Button>
                </form>
              </div>
            )}
            {props.links.map((link) => (
              <div>
                {link.title} - {link.url}
              </div>
            ))}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Bierzmowanie;

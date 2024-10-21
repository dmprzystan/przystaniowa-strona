"use client";

import React, { useState } from "react";
import Editor from "../../wyjazdy/add/components/Editor";

import "@/app/bierzmowanie/style.scss";
import { useMessage } from "../../AdminContext";

function Bierzmowanie(props: { statute: string }) {
  const [statute, setStatute] = useState(props.statute);
  const [lastSaved, setLastSaved] = useState(props.statute);

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
      </div>
    </div>
  );
}

export default Bierzmowanie;

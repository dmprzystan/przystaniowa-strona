"use client";

import React, { useState } from "react";
import Editor from "../../wyjazdy/add/components/Editor";

import "@/app/regulamin/style.scss";

function Regulamin(props: { statute: string }) {
  const [statute, setStatute] = useState(props.statute);
  const [lastSaved, setLastSaved] = useState(props.statute);

  const [isEditing, setIsEditing] = useState(false);

  const save = async () => {
    setLastSaved(statute);
    setIsEditing(false);

    const response = await fetch("/api/admin/statue", {
      method: "PUT",
      body: statute,
    });

    if (response.ok) {
      alert("Zapisano regulamin");
    } else {
      alert("Błąd podczas zapisywania regulaminu");
    }

    fetch("/api/admin/statue").then(async (response) => {
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
    <div className="px-4 sm:px-16 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl text-center">Regulamin</h2>
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
      <div className="flex flex-col gap-8 mt-16">
        {isEditing ? (
          <Editor
            value={statute}
            setValue={setStatute}
            classname="regulamin !text-black"
          />
        ) : (
          <div
            className="regulamin mt-4 !text-black"
            dangerouslySetInnerHTML={{ __html: statute }}
          />
        )}
      </div>
    </div>
  );
}

export default Regulamin;

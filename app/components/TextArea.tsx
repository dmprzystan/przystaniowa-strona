"use client";

import React from "react";
import { useState, useId } from "react";

type TextAreaProps = {
  label: string;
  name: string;
};

function TextArea(props: TextAreaProps) {
  const [labelMove, setLabelMove] = useState(false);

  const { label, name } = props;
  const id = `${name}-${useId()}`;

  return (
    <div className="relative mt-10 sm:mt-0 sm:flex-1">
      <label
        className="absolute uppercase text-[#1E1E1E] opacity-70 text-base transition-all left-2 top-2 data-[moved]:-top-6"
        htmlFor={id}
        {...(labelMove ? { "data-moved": true } : {})}
      >
        {label}
      </label>
      <textarea
        className="bg-transparent shadow-arround resize-none focus:outline-none px-2 py-2 h-52 sm:h-full w-full rounded-lg"
        name={name}
        id={id}
        required={true}
        onFocus={() => setLabelMove(true)}
        onBlur={(e) => setLabelMove(e.target.value.length > 0)}
      />
    </div>
  );
}

export default TextArea;

"use client";

import React, { useId } from "react";
import { useState } from "react";

type InputProps = {
  label: string;
  name: string;
  type: React.HTMLInputTypeAttribute;
  required: boolean | undefined;
};

function Input(props: InputProps) {
  const [labelMove, setLabelMove] = useState(false);

  const { label, name, type, required } = props;
  const id = `${name}-${useId()}`;

  return (
    <div className="relative w-full">
      <label
        className="absolute uppercase text-[#1E1E1E] opacity-70 text-base transition-all left-2 top-3 data-[moved]:-top-6"
        htmlFor={id}
        {...(labelMove ? { "data-moved": true } : {})}
      >
        {label}
      </label>
      <input
        className="bg-transparent focus:outline-none px-2 pt-2 pb-1 w-full"
        name={name}
        id={id}
        type={type}
        required={required || false}
        onFocus={() => setLabelMove(true)}
        onBlur={(e) => setLabelMove(e.target.value.length > 0)}
        onChange={(e) => setLabelMove(e.target.value.length > 0)}
      />
      <div className="shadow-arround w-full h-px bg-[#C2C2C2]" />
    </div>
  );
}

export default Input;

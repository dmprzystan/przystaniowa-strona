"use client";

import React, { useEffect, useState } from "react";
import EmailTile from "./EmailTile";

function StronaGlowna() {
  return (
    <div className="p-4">
      <div>
        <h1 className="text-3xl">Witaj w panelu administracyjnym</h1>
        <p className="mt-2">
          Tutaj możesz zarządzać treścią strony internetowej.
        </p>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 mt-4">
        <EmailTile />
      </div>
    </div>
  );
}

export default StronaGlowna;

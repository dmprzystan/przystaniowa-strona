"use client";

import React, { useEffect, useState } from "react";
import EmailTile from "./tiles/EmailTile";
import StorageTile from "./tiles/StorageTile";

function StronaGlowna() {
  return (
    <div className="p-4">
      <div className="mx-14 md:mx-0">
        <h1 className="text-3xl text-center md:text-left">
          Witaj w panelu administracyjnym
        </h1>
        <p className="mt-1 text-center font-light md:text-left">
          Tutaj możesz zarządzać treścią strony internetowej.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 lg:mt-8 gap-4 lg:gap-12 w-full">
        <EmailTile />
        <StorageTile />
      </div>
    </div>
  );
}

export default StronaGlowna;

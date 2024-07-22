"use client";

import Calendar from "@/app/wyjazdy/components/Calendar";
import Link from "next/link";

function Wyjazdy() {
  return (
    <>
      <div className="px-4 sm:px-16 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl text-center">Wyjazdy</h2>
          <Link
            href="/admin/wyjazdy/add"
            className="bg-green-500 text-white rounded-lg py-2 px-4 shadow-none hover:shadow-lg duration-300 transition-all"
          >
            Dodaj
          </Link>
        </div>
        <div>
        </div>
      </div>
    </>
  );
}

export default Wyjazdy;

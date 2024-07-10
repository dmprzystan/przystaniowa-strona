"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const pathname = usePathname();

  const pages = [
    { name: "Strona główna", href: "/admin" },
    { name: "Plan tygodnia", href: "/admin/plan" },
    { name: "Gazetka", href: "/admin/gazetka" },
    { name: "Ogłoszenia", href: "/admin/ogloszenia" },
    { name: "Wyjazdy", href: "/admin/wyjazdy" },
    { name: "Wiadomości", href: "/admin/wiadomosci" },
  ];

  return (
    <aside className="flex flex-col items-center pr-8 border-r border-r-gray-300 flex-shrink-0">
      <Link href="/">
        <Image
          className="w-64"
          src="/images/logo.png"
          alt="Przystań"
          width={300}
          height={200}
        />
      </Link>
      <nav className="mt-8 w-full px-4">
        <ul className="flex flex-col gap-4">
          {pages.map((page) => (
            <li key={page.href}>
              <Link
                className={`hover:bg-gray-50 hover:shadow-md transition-all px-4 py-2 rounded-2xl cursor-pointer block ${
                  pathname === page.href ? "bg-gray-50 shadow-md" : ""
                }`}
                href={page.href}
              >
                {page.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Navbar;

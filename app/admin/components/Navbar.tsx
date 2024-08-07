"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const [isInTransition, setIsInTransition] = React.useState(false);

  const pages = [
    { name: "Strona główna", href: "/admin" },
    { name: "Plan tygodnia", href: "/admin/plan" },
    { name: "Gazetka", href: "/admin/gazetka" },
    { name: "Wyjazdy", href: "/admin/wyjazdy" },
    { name: "Galeria", href: "/admin/galeria" },
    { name: "Regulamin", href: "/admin/regulamin" },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col items-center lg:pr-4 border-r border-r-gray-300 flex-shrink-0">
        <Link href="/">
          <Image
            className="w-64"
            src="/images/logo.png"
            alt="Przystań"
            width={300}
            height={200}
          />
        </Link>
        <nav className="mt-8 w-full px-4 md:px-2 lg:px-4">
          <ul className="flex flex-col gap-4">
            {pages.map((page) => (
              <li key={page.href}>
                <Link
                  className={`hover:bg-gray-50 hover:shadow-md transition-all px-4 py-2 rounded-2xl cursor-pointer block ${
                    page.href === "/admin"
                      ? pathname === page.href
                        ? "bg-gray-50 shadow-md"
                        : ""
                      : pathname.startsWith(page.href)
                      ? "bg-gray-50 shadow-md"
                      : ""
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
      <aside className="md:hidden fixed z-50">
        <button
          className="fixed top-4 left-4 px-2 py-2 bg-white shadow-lg rounded-full bg-opacity-25 backdrop-blur-lg z-50"
          onClick={() => {
            if (isInTransition) return;

            if (isMenuOpen) {
              setIsInTransition(true);
              setIsMenuOpen(false);
              setTimeout(() => {
                setIsMenuVisible(false);
                setIsInTransition(false);
              }, 300);
            } else {
              setIsInTransition(true);
              setIsMenuVisible(true);
              setTimeout(() => setIsMenuOpen(true), 0);
              setTimeout(() => setIsInTransition(false), 300);
            }
          }}
        >
          <Image
            src="/images/menu-icon.svg"
            alt="menu"
            width={24}
            height={24}
          />
        </button>
        <div
          className="w-screen h-screen fixed top-0 left-0 bg-white bg-opacity-40 transition-all duration-300 backdrop-blur-0 data-[open]:backdrop-blur-lg data-[visible]:block hidden opacity-0 data-[open]:opacity-100"
          {...(isMenuOpen ? { "data-open": "true" } : {})}
          {...(isMenuVisible ? { "data-visible": "true" } : {})}
        >
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
                      page.href === "/admin"
                        ? pathname === page.href
                          ? "bg-gray-50 shadow-md"
                          : ""
                        : pathname.startsWith(page.href)
                        ? "bg-gray-50 shadow-md"
                        : ""
                    }`}
                    href={page.href}
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Navbar;

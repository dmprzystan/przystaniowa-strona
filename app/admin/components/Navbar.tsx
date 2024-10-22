"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function Navbar() {
  const pathname = usePathname();

  const pages = [
    { name: "Strona główna", href: "/admin" },
    { name: "Plan tygodnia", href: "/admin/plan" },
    { name: "Bierzmowanie", href: "/admin/bierzmowanie" },
    { name: "Gazetka", href: "/admin/gazetka" },
    { name: "Wyjazdy", href: "/admin/wyjazdy" },
    { name: "Galeria", href: "/admin/galeria" },
    { name: "Regulamin", href: "/admin/regulamin" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin" && pathname === href) {
      return "bg-gray-50 shadow-md";
    }

    if (pathname.startsWith(href)) {
      return "bg-gray-50 shadow-md";
    }

    return "";
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {isDesktop ? (
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
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full fixed top-4 left-4 z-50"
            >
              <HamburgerMenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-4/5 min-w-80 [&>button]:!ring-transparent"
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
                      className={`hover:bg-gray-50 hover:shadow-md transition-all px-4 py-2 rounded-2xl cursor-pointer block ${isActive(
                        page.href
                      )}`}
                      href={page.href}
                    >
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

export default Navbar;

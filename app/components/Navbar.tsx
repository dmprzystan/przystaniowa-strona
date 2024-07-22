"use client";

import React from "react";
import Image from "next/image";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const [isInTransition, setIsInTransition] = React.useState(false);

  const links = [
    { href: "/", label: "o nas" },
    { href: "/bierzmowanie", label: "bierzmowanie" },
    { href: "/gazetka", label: "gazetka" },
    { href: "/wyjazdy", label: "wyjazdy" },
    { href: "/galeria", label: "galeria" },
  ];

  return (
    <>
      <div className="hidden sm:block sticky top-0 z-50">
        <nav className="mt-6 bg-white py-3 md:py-4 shadow-lg">
          <ul className="flex justify-evenly text-sm md:text-base lg:text-lg xl:text-xl container mx-auto">
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`}>
                <a href={href} className="uppercase">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="sm:hidden fixed z-50">
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
          <nav className="mt-20 mx-6">
            <ul className="flex flex-col justify-evenly text-xl container mx-auto gap-4">
              {links.map(({ href, label }) => (
                <li key={`${href}${label}`}>
                  <a href={href} className="uppercase">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar;

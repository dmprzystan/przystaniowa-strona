import Image from "next/image";
import { Inika } from "next/font/google";

const inika = Inika({ weight: ["400"], subsets: ["latin", "latin-ext"] });

function Header() {
  return (
    <header className="flex flex-col sm:flex-row justify-center items-center container mx-auto px-2 mt-4 sm:mt-8">
      <Image
        src="/images/logo.png"
        alt="logo"
        width={300}
        height={200}
        className="w-auto h-32 sm:h-36 md:h-44 lg:h-52"
      />
      <div className="flex flex-col items-center sm:items-start gap-3">
        <h1
          className={`text-5xl md:text-6xl lg:text-[80px] sm:ml-12 font-normal ${inika.className}`}
        >
          Przystań
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-center uppercase">
          dominikańskie duszpasterstwo młodzieżowe
        </p>
      </div>
    </header>
  );
}

export default Header;

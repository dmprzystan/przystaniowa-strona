import Link from "next/link";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { Inter } from "next/font/google";
import { getTrips } from "../lib/prisma";

const inter = Inter({
  weight: ["400", "800"],
  subsets: ["latin", "latin-ext"],
});

async function page() {
  const trips = await getTrips();

  return (
    <>
      <Link href="/" className="focus:outline-none">
        <Header />
      </Link>
      <Navbar />
      <div className="container mx-auto pb-8 pt-4 md:pt-6 lg:pt-8 xl:pt-12 mt-8 sm:mt-4">
        <h2 className="text-3xl sm:text-4xl xl:text-5xl text-center">
          WYJAZDY
        </h2>
        <div
          className={`px-8 md:px-16 xl:px-32 flex flex-col sm:flex-row items-center sm:flex-wrap justify-between gap-12 lg:gap-y-16 mt-16 ${inter.className}`}
        ></div>
      </div>
    </>
  );
}

export const revalidate = false;

export default page;

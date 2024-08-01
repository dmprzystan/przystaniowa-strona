import Link from "next/link";
import { getStatute } from "@/app/lib/oci";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default async function Page() {
  const statute = await getStatute();

  return (
    <>
      <Link href="/" className="focus:outline-none">
        <Header />
      </Link>
      <Navbar />
      <div className="container mx-auto pb-8">
        <main className="pt-4 md:pt-6 lg:pt-8 xl:pt-12 mt-8 sm:mt-4 bg-dimmedBlue pb-8 rounded-t-2xl">
          <h2 className="text-white text-3xl sm:text-4xl xl:text-5xl uppercase text-center">
            regulamin
          </h2>
          <div
            className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mt-4"
            dangerouslySetInnerHTML={{ __html: statute }}
          />
        </main>
        <img
          src="/images/bg-contact-bottom.svg"
          alt=""
          className="w-full -mt-px"
        />
      </div>
    </>
  );
}

export const revalidate = false;

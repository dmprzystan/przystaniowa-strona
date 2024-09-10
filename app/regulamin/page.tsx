import Link from "next/link";
import { getStatute } from "@/app/lib/oci";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import "./style.scss";

export default async function Page() {
  const statute = await getStatute();

  return (
    <>
      <Link href="/" className="focus:outline-none">
        <Header />
      </Link>
      <Navbar />
      <div className="container mx-auto pb-8">
        <main className="pt-4 md:pt-6 lg:pt-8 xl:pt-12 mt-8 sm:mt-4 bg-[#61769A] pb-8 rounded-t-2xl">
          <h2 className="text-white text-3xl sm:text-4xl xl:text-5xl uppercase text-center">
            regulamin
          </h2>
          <div
            className="regulamin"
            dangerouslySetInnerHTML={{ __html: statute }}
          />
        </main>
        <img src="/images/bg-statue.svg" alt="" className="w-full -mt-px" />
      </div>

      <SpeedInsights />
      <Analytics />
    </>
  );
}

export const revalidate = false;

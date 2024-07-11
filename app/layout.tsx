import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Inika } from "next/font/google";
import "./globals.css";

const inika = Inika({ weight: ["400"], subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Dominikańskie Duszpasterstwo Młodzieży Przystań - Dominikanie Kraków",
  description:
    "Dominikańskie Duszpasterstwo Młodzieży Przystań - Dominikanie Kraków",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="bg-[#F2F2F2]">
      <body className={`${inika.className} bg-[#F2F2F2]`}>
        {children}
        <SpeedInsights />
      </body>
      <Analytics />
    </html>
  );
}

export const revalidate = false;

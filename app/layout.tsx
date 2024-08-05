import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import Head from "next/head"
import "./globals.css";

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

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
      <Head>
        <meta name="google-site-verification" content="iJECGwc0x7S9ntjUbeidgchhZ0eDS4y05hB3UnM5bRM" />
      </Head>
      <body className={`${inter.className} bg-[#F2F2F2]`}>
        {children}
        <SpeedInsights />
      </body>
      <Analytics />
    </html>
  );
}

export const revalidate = false;

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Dominikańskie Duszpasterstwo Młodzieży Przystań - Dominikanie Kraków",
  description:
    "Dominikańskie Duszpasterstwo Młodzieży Przystań - Dominikanie Kraków",
  verification: {
    google: "omLqm-Ril2B2tij9lVMj6WPimoSq-g2Omx2EG9MyLW0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="bg-[#F2F2F2]">
      <body className={`${inter.className} bg-[#F2F2F2]`}>{children}</body>
    </html>
  );
}

export const revalidate = false;

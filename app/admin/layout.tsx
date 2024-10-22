"use client";

import React from "react";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="container mx-auto min-h-screen flex flex-row py-12">
        {children}
      </div>
      <Toaster />
    </>
  );
}

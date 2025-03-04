"use client";

import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="container mx-auto h-full flex flex-row overflow-x-hidden">
        {children}
      </div>
      <Toaster />
    </>
  );
}

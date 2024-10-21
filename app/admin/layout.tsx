"use client";

import React from "react";
import { MessageProvider } from "@/app/admin/AdminContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MessageProvider>
      <div className="container mx-auto min-h-screen flex flex-row py-12">
        {children}
      </div>
    </MessageProvider>
  );
}

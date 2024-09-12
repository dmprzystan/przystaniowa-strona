"use client";

import React, { useState, useContext } from "react";

type Message = {
  type: "success" | "message" | "warning" | "error";
  message: string;
};

const MessageContext = React.createContext<{
  message: Message | null;
  setMessage: (message: Message | null) => void;
}>({
  message: null,
  setMessage: () => {},
});

export const useMessage = () => useContext(MessageContext);

const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState<Message | null>({
    type: "message",
    message: "Hello",
  });

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
      {message && (
        <div className="fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-white bg-opacity-20 backdrop-blur-lg">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            {message.message}
          </div>
        </div>
      )}
    </MessageContext.Provider>
  );
};

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

"use client";

import {
  CheckCircle,
  CheckCircleRounded,
  CloseRounded,
  ErrorRounded,
} from "@mui/icons-material";
import React, { useState, useContext, useEffect } from "react";

type Toast = {
  id: number;
  type: "success" | "message" | "warning" | "error";
  message: string;
  timeout?: Timer | undefined;
};

type ToastProps = {
  type: "success" | "message" | "warning" | "error";
  message: string;
  timeout?: number | undefined;
};

const MessageContext = React.createContext<{
  toasts: Toast[] | null;
  addToast: (props: ToastProps) => void;
}>({
  toasts: null,
  addToast: () => {},
});

export const useMessage = () => useContext(MessageContext);

const typeToMessage = (type: "success" | "message" | "warning" | "error") => {
  switch (type) {
    case "success":
      return "Sukces";
    case "error":
      return "Coś poszło nie tak";
    default:
      return "Coś poszło nie tak";
  }
};
const typeToClass = (type: "success" | "message" | "warning" | "error") => {
  switch (type) {
    case "success":
      return "from-green-100 to-white border-white";
    case "error":
      return "from-red-100 to-white border-white";

    default:
      return "Coś poszło nie tak";
  }
};

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (props: ToastProps) => {
    const toast: Toast = {
      id: Date.now(),
      type: props.type,
      message: props.message,
    };

    if (props.timeout !== -1) {
      const timeout = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => toast.id !== t.id));
      }, props.timeout || 5000);
      toast.timeout = timeout;
    }

    setToasts((prev) => [...prev, toast]);
  };

  return (
    <MessageContext.Provider value={{ toasts, addToast }}>
      {children}
      {toasts && (
        <div className="fixed right-2 bottom-2 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`w-80 bg-white rounded-lg px-4 py-4 flex items-start justify-between bg-gradient-to-b shadow-md border-[3px] ${typeToClass(
                toast.type
              )}`}
            >
              <div className="flex items-start gap-4">
                <div className="p-1 bg-white rounded-full shadow-red-300 shadow-arround">
                  {toast.type === "success" && (
                    <CheckCircleRounded className="text-green-500" />
                  )}
                  {toast.type === "error" && (
                    <ErrorRounded className="text-red-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {typeToMessage(toast.type)}
                  </h3>
                  <p className="text-gray-600 text-sm font-light">
                    {toast.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  clearTimeout(toast.timeout);
                  setToasts((prev) => prev.filter((t) => toast.id !== t.id));
                }}
                className="ml-4"
              >
                <CloseRounded className="text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </MessageContext.Provider>
  );
};

import React, { useState, useContext, useEffect } from "react";

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

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  // const [message, setMessage] = useState<Message | null>({
  //   type: "message",
  //   message: "Hello",
  // });
  const [message, setMessage] = useState<Message | null>(null);
  const [messageTimeout, setMessageTimeout] = useState<Timer | null>(null);

  useEffect(() => {
    if (message) {
      if (messageTimeout) {
        clearTimeout(messageTimeout);
      }

      setMessageTimeout(
        setTimeout(() => {
          setMessage(null);
        }, 5000)
      );
    } else {
      if (messageTimeout) {
        clearTimeout(messageTimeout);
      }
    }

    return () => {
      if (messageTimeout) {
        clearTimeout(messageTimeout);
      }
    };
  }, [message]);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
      {message && (
        <div className="fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-white bg-opacity-20 backdrop-blur-lg">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <button
              onClick={() => {
                setMessage(null);
                setMessageTimeout(null);
              }}
            >
              x
            </button>
            {message.message}
          </div>
        </div>
      )}
    </MessageContext.Provider>
  );
};

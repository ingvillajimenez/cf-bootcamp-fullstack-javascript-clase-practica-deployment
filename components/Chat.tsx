"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface ChatProps {
  userId?: string;
  email?: string;
}

export default function Chat({ userId, email }: ChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [subscribed, setSubscribed] = useState(false);
  const supabase = createClient();

  // Realtime subscriptions
  // Broadcast
  // Send any data to any client subscribed to the same Channel.
  const channel = supabase.channel("general", {
    config: {
      broadcast: { self: true },
    },
  });

  useEffect(() => {
    channel.subscribe((status) => {
      console.log(status);
      if (status === "SUBSCRIBED") {
        setSubscribed(true);
      }
    });

    channel.on(
      "broadcast",
      {
        event: "message",
      },
      ({ payload }) => {
        setMessages((prevMessages: any) => [...prevMessages, payload]);
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [channel]);

  function onHandleSubmit(e: any) {
    e.preventDefault();
    if (subscribed) {
      channel.send({
        type: "broadcast",
        event: "message",
        payload: {
          message,
          userId,
          email,
        },
      });

      setMessage("");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex-1">
        <ul className="flex flex-col gap-1.5">
          {messages.map(({ email, message }: any, index: number) => (
            <li key={index}>
              <div className="flex flex-col gap-0.5 bg-red-400 text-stone-800 px-4 py2">
                <span className="font-bold">{email}:</span>
                <p>{message}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form className="flex gap-1 items-center" onSubmit={onHandleSubmit}>
        <input
          className="px-3 py-1.5 flex-1 outline-none"
          type="text"
          placeholder="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>Send</button>
      </form>
    </div>
  );
}

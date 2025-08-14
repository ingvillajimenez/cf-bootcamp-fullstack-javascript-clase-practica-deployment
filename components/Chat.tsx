"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface ChatProps {
  userId?: string;
}

export default function Chat({ userId }: ChatProps) {
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
          user: userId,
        },
      });

      setMessage("");
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <ul>
          {messages.map(({ message }: any, index: number) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={onHandleSubmit}>
        <input
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

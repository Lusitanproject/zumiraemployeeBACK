"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

import { generateResponse } from "@/api/acts";
import { cn } from "@/lib/utils";
import { ActChapter, ActMessage } from "@/types/act";

import { MessageInput } from "../message-input";
import { Messages } from "./components/messages";

interface ActChatProps {
  actChapter?: ActChapter;
  inputWarning?: string;
  onChangeMessages?: (messages: ActMessage[]) => void;
}

export function ActChat({ actChapter, inputWarning, onChangeMessages }: ActChatProps) {
  const [messages, setMessages] = useState<ActMessage[]>(actChapter?.messages ?? []);
  const [loading, setLoading] = useState<boolean>(false);
  const [showRule, setShowRule] = useState<boolean>(false);

  async function sendMessage(text: string) {
    if (!actChapter) return;

    let now: Date;

    flushSync(() => {
      now = new Date();
      setLoading(true);
      setMessages((prev) => [...prev, { content: text, role: "user", createdAt: now, updatedAt: now }]);
    });

    try {
      const response = await generateResponse({ actChapterId: actChapter.id, content: text });
      now = new Date();

      setMessages((prev) => [...prev, { content: response, role: "assistant", createdAt: now, updatedAt: now }]);
    } catch {
      flushSync(() => {
        setMessages((prev) => {
          const message = prev[-1];
          if (message) {
            message.error = true;
          }
          return [...prev];
        });
      });
    } finally {
      setLoading(false);
      onChangeMessages?.(messages);
    }
  }

  useEffect(() => {
    setMessages(actChapter?.messages ?? []);
  }, [actChapter]);

  return (
    <section className="relative flex flex-col size-full p-4 pt-0">
      {showRule && <hr className="text-text-200 bottom-0 w-full" />}
      <Messages loadingResponse={loading} messages={messages} onScroll={setShowRule} />

      <div className={cn("relative flex w-full duration-500", messages.length ? "pb-0" : "sm:pb-80 pb-56")}>
        <span
          className={cn(
            "absolute bottom-full w-full sm:pb-7 pb-4 sm:text-3xl text-2xl text-text-700 font-medium text-center duration-500 ease-in-out",
            {
              "opacity-0": messages.length,
            }
          )}
        >
          {actChapter?.actChatbot.initialMessage}
        </span>
        <MessageInput
          disabled={!actChapter || loading}
          expandOnFocus={!!messages.length}
          placeholder="Conte aqui a sua história"
          warning={inputWarning}
          onSend={sendMessage}
        />
      </div>
    </section>
  );
}

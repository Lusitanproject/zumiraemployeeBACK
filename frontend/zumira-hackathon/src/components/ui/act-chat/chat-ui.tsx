"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

import { generateResponse } from "@/api/acts";
import { MessageInput } from "@/components/ui/chatbase-chat/components/message-input";
import { ActChapter, ActMessage } from "@/types/acts";

import { Messages } from "./messages";

interface ChatUiProps {
  actChapter?: ActChapter;
  inputWarning?: string;
}

export function ChatUi({ actChapter, inputWarning }: ChatUiProps) {
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
    }
  }

  useEffect(() => {
    setMessages(actChapter?.messages ?? []);
  }, [actChapter]);

  return (
    <section className="relative flex flex-col size-full min-w-96 overflow-x-scroll p-4 pt-0">
      {/* <h1 className="text-gray-300 text-lg font-semibold mb-2">{actChapter.actChatbot.name}</h1> */}
      {showRule && <hr className="text-gray-200 bottom-0 w-full" />}
      <Messages loadingResponse={loading} messages={messages} onScroll={setShowRule} />
      <MessageInput
        disabled={!actChapter}
        placeholder="Pergunte alguma coisa"
        warning={inputWarning}
        onSend={sendMessage}
      />
    </section>
  );
}

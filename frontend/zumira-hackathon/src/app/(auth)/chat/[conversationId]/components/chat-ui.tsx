"use client";

import { MessageInput } from "@/components/ui/chat/components/message-input";
import { ActConversation, Message } from "../definitions";
import { useState } from "react";
import { Messages } from "./messages";
import { generateResponse } from "../actions";
import { flushSync } from "react-dom";

interface ChatUiProps {
  actConversation: ActConversation;
  oldMessages: Message[];
}

export function ChatUi({ actConversation, oldMessages }: ChatUiProps) {
  const [messages, setMessages] = useState<Message[]>(oldMessages);
  const [loading, setLoading] = useState<boolean>(false);
  const [showRule, setShowRule] = useState<boolean>(false);

  async function sendMessage(text: string) {
    let now: Date;

    flushSync(() => {
      now = new Date();
      setLoading(true);
      setMessages((prev) => [...prev, { content: text, role: "user", createdAt: now, updatedAt: now }]);
    });

    const response = await generateResponse({ actConversationId: actConversation.id, content: text });
    now = new Date();

    setMessages((prev) => [...prev, { content: response, role: "assistant", createdAt: now, updatedAt: now }]);
    setLoading(false);
  }

  return (
    <section className="relative flex flex-col size-full p-4 pt-0">
      <h1 className="text-gray-300 text-lg font-semibold mb-2">{actConversation.actChatbot.name}</h1>
      {showRule && <hr className="text-gray-200 bottom-0 w-full" />}
      <Messages messages={messages} loadingResponse={loading} onScroll={setShowRule} />
      <MessageInput placeholder="Pergunte alguma coisa" onSend={sendMessage} />
    </section>
  );
}

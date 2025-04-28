"use client";

import { MessageInput } from "@/components/ui/chat/components/message-input";
import { Messages } from "@/components/ui/chat/components/messages";
import { ReactNode, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { ChatMessage } from "./definitions";
import { messageChatbot } from "./actions";

interface AssistantChatProps {
  chatbotId: string;
  username: string;
  children?: ReactNode;
  context?: ChatMessage[];
}

export function Chat({ children, username, chatbotId, context }: AssistantChatProps) {
  const id = btoa(username + chatbotId.slice(0, 5));

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(formData: FormData) {
    const content = formData.get("message") as string;

    if (!content.trim()) return;

    const message = { content, role: "user" } as ChatMessage;
    const newMessages = [...messages, message];

    // Forçar a re-renderização
    flushSync(() => {
      setMessages(newMessages);
      setLoading(true);
    });

    messageChatbot(chatbotId, username, messages, message, context)
      .then((response) => {
        if (!response?.text) {
          message.error = "Erro ao processar uma resposta";
        } else {
          const responseMessage = {
            content: response.text,
            role: "assistant",
          } as ChatMessage;

          setMessages([...newMessages, responseMessage]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Persistência das mensagens em localstorage é temporario até guardar no banco de dados (pós MVP)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem(id);
      const parsed = value ? JSON.parse(value) : null;
      if (parsed) setMessages(parsed);
    }
  }, [id]);

  useEffect(() => {
    if (id && messages.length) {
      localStorage.setItem(id, JSON.stringify(messages));
    }
  }, [messages, id]);

  return (
    <div className="relative flex flex-col size-full p-4 pt-0">
      <Messages messages={messages} loadingResponse={loading} />

      <div
        className={`absolute size-full duration-200 pointer-events-none left-0 top-0 ${
          messages.length === 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        {children}
      </div>

      <MessageInput placeholder="Pergunte alguma coisa" action={handleSubmit} />
    </div>
  );
}

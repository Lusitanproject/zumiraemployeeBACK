"use client";

import { useEffect, useState } from "react";
import { ChatMessage } from "../definitions";
import { sendMessage } from "../actions";
import { Messages } from "./messages";
import { MessageInput } from "./message-input";
import { Greeting } from "./greeting";
import { flushSync } from "react-dom";

interface ChatUiProps {
    username: string;
    chatId?: string;
}

export function ChatUi({ username, chatId }: ChatUiProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSubmit(formData: FormData) {
        const content = formData.get("message") as string;

        if (!content.trim()) return;

        const message = {
            content: content,
            role: "user",
        } as ChatMessage;

        const newMessages = [...messages, message];

        // Forçar a re-renderização
        flushSync(() => {
            setMessages(newMessages);
            setLoading(true);
        });

        sendMessage(newMessages)
            .then((response) => {
                if (!response?.text) {
                    message.error = "Erro ao processar uma resposta";
                    return;
                }

                const responseMessage = {
                    content: response.text,
                    role: "assistant",
                } as ChatMessage;

                setMessages([...newMessages, responseMessage]);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // Persistência das mensagens em localstorage é temporario até guardar no banco de dados (pós MVP)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const value = localStorage.getItem("messages");
            const parsed = value ? JSON.parse(value) : null;
            if (parsed && parsed.id === chatId) setMessages(parsed.messages);
        }
    }, []);

    useEffect(() => {
        if (chatId) {
            localStorage.setItem("messages", JSON.stringify({ messages: messages, id: chatId }));
        }
    }, [messages]);

    return (
        <div className="flex flex-col size-full overflow-hidden justify-between">
            <Greeting name={username} closed={!!messages.length} />
            <Messages messages={messages} loadingResponse={loading} />
            <MessageInput action={handleSubmit} disabled={loading} />
        </div>
    );
}

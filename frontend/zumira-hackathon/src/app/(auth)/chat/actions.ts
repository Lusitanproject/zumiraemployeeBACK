"use server";

import { cookies } from "next/headers";
import { ChatMessage, ChatResponse } from "./definitions";
import { catchError } from "@/utils/error";
import { decrypt } from "@/app/_lib/session";

// Uso deve ser evitado em desenvolvimento para não estourar os créditos
export async function sendMessage(messages: ChatMessage[]): Promise<ChatResponse | null> {
    const cookie = await cookies();
    const session = decrypt(cookie.get("session")?.value);

    const body = {
        messages: [{ content: `Meu nome é ${session?.name}`, role: "user" }, ...messages],
        chatbotId: process.env.CHATBASE_CHATBOT_ID,
    };

    const [error, response] = await catchError(
        fetch("https://www.chatbase.co/api/v1/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.CHATBASE_SECRET_KEY}`,
            },
            body: JSON.stringify(body),
        })
    );

    if (error) {
        return null;
    }

    const parsed = (await response.json()) as ChatResponse;

    return parsed;
}

// Usada para testes
export async function mockSendMessage(messages: ChatMessage[]): Promise<ChatResponse | null> {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 10% de chance de erro
            if (Math.random() < 0.1) {
                resolve(null);
                return;
            }

            const lastMessage = messages[messages.length - 1]?.content || "Sem mensagem";
            resolve({ text: `Resposta automática para: "${lastMessage}"` });
        }, Math.random() * 1500);
    });
}

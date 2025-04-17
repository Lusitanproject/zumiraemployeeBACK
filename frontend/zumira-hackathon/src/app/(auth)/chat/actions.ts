"use server";

import { cookies } from "next/headers";
import { ChatContext, ChatMessage, ChatResponse, GetFeedback } from "./definitions";
import { catchError } from "@/utils/error";
import { decrypt } from "@/app/_lib/session";

// Uso deve ser evitado em desenvolvimento para não estourar os créditos
export async function sendMessage(messages: ChatMessage[], context: ChatContext): Promise<ChatResponse | null> {
  const oldMessages = messages.slice(0, -1);
  const newMessage = messages.at(-1);

  const body = {
    messages: [
      { content: `Meu nome é ${context.username}`, role: "user" },
      ...oldMessages,
      ...context.feedbacks.map((f) => ({
        content: `TESTE: ${f.assessment.title}\nRESULTADO/DEVOLUTIVA: ${f.text}`,
        role: "user",
      })), // Testes são enviados entre as mengagens anteriores e a nova para sempre manter o contexto atualizado
      newMessage,
    ],
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
    }),
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

export async function getFeedbacks() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/assessments/feedback`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    }),
  );

  if (error) {
    return { status: "ERROR", data: [], message: error.message };
  }

  if (!response.ok) {
    return { status: "ERROR", data: [], message: response.statusText };
  }

  const parsed = (await response.json()) as GetFeedback;

  return {
    status: parsed.status,
    data: parsed.status === "SUCCESS" ? parsed.data.items : [],
    message: parsed.status === "ERROR" ? parsed.message : null,
  };
}

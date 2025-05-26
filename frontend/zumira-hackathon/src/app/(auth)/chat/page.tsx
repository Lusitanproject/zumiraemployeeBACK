import { cookies } from "next/headers";
import { decrypt } from "@/app/_lib/session";
import { getResults } from "./actions";
import { Chat as ChatComponent } from "@/components/ui/chat/chat";
import { ChatMessage } from "@/components/ui/chat/definitions";

export default async function Chat() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);
  const name = session?.name ?? "Usuário";
  const chatbotId = process.env.CHATBASE_CHATBOT_ID;
  const results = (await getResults()).data;
  const context = results.map((r) => ({
    content: `TESTE: ${r.assessment.title}\nRESULTADO/DEVOLUTIVA: ${r.feedback}`,
    role: "user",
  })) as ChatMessage[];

  if (!chatbotId) return null;

  // Combinação de nome+role é provisória e causará inconsistências
  return (
    <ChatComponent chatbotId={chatbotId} username={name} context={context}>
      <p className="text-4xl transition-opacity duration-200 mt-4 h-auto">
        Olá <strong>{name}</strong>, como posso te ajudar hoje?
      </p>
    </ChatComponent>
  );
}

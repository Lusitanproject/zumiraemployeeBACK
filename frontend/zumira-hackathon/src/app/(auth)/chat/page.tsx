import { cookies } from "next/headers";
import { ChatUi } from "./components/chat-ui";
import { decrypt } from "@/app/_lib/session";
import { getFeedbacks } from "./actions";

export default async function Chat() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);
  const feedbacks = (await getFeedbacks()).data;

  // Combinação de nome+role é provisória e causará inconsistências
  return (
    <ChatUi
      context={{ username: session?.name ?? "Usuário", feedbacks: feedbacks }}
      chatId={btoa(session ? session?.name + session?.role : "")}
    />
  );
}

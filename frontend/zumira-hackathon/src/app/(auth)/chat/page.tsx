import { cookies } from "next/headers";
import { ChatUi } from "./components/chat-ui";
import { decrypt } from "@/app/_lib/session";

export default async function Chat() {
    const cookie = await cookies();
    const session = decrypt(cookie.get("session")?.value);

    // Combinação de nome+role é provisória e causará inconsistências
    return (
        <ChatUi username={session?.name ?? "Usuário"} chatId={session ? session?.name + session?.role : undefined} />
    );
}

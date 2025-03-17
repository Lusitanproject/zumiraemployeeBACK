import { cookies } from "next/headers";
import { ChatUi } from "./components/chat-ui";
import { decrypt } from "@/app/_lib/session";

export default async function Chat() {
    const cookie = await cookies();
    const session = decrypt(cookie.get("session")?.value);

    return <ChatUi username={session?.name ?? "Usuário"} />;
}

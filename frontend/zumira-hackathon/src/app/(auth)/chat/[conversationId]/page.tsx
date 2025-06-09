import { getActConversation } from "./actions";
import { ChatUi } from "./components/chat-ui";

export default async function Chat({ params }: { params: Promise<{ conversationId: string }> }) {
  const conversationId = (await params).conversationId;
  const conversation = await getActConversation(conversationId);

  return <ChatUi oldMessages={conversation.messages} actConversation={conversation} />;
}

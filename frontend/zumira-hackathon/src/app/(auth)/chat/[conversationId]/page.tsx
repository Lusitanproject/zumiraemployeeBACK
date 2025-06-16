import { getActConversation } from "@/api/acts";

import { ChatUi } from "../../../../components/ui/act-chat/chat-ui";

export default async function Chat({ params }: { params: Promise<{ conversationId: string }> }) {
  const conversationId = (await params).conversationId;
  const conversation = await getActConversation(conversationId);

  return <ChatUi actConversation={conversation} />;
}

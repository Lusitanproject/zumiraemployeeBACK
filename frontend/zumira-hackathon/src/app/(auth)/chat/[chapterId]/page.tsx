import { getActChapter } from "@/api/acts";

import { ChatUi } from "../../../../components/ui/act-chat/chat-ui";

export default async function Chat({ params }: { params: Promise<{ chapterId: string }> }) {
  const chapterId = (await params).chapterId;
  const chapter = await getActChapter(chapterId);

  return <ChatUi actChapter={chapter} />;
}

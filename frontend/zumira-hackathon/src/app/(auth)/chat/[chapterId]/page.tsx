import { getActChapter } from "@/api/acts";

import { Whiteboard } from "./components/whiteboard";

export default async function Chat({ params }: { params: Promise<{ chapterId: string }> }) {
  const chapterId = (await params).chapterId;
  const chapter = await getActChapter(chapterId);

  return <Whiteboard actChapter={chapter} />;
}

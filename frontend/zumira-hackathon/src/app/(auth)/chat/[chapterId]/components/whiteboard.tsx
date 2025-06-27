"use client";

import { ArrowBigRightDash } from "lucide-react";
import { useRef, useState } from "react";

import { ChatUi } from "@/components/ui/act-chat/chat-ui";
import { cn } from "@/lib/utils";
import { ActChapter } from "@/types/acts";

import { Book, BookRef } from "./book";

interface WhiteboardProps {
  actChapter: ActChapter;
}

export function Whiteboard({ actChapter }: WhiteboardProps) {
  const MIN_MESSAGES_TO_FINISH = 10;

  const bookRef = useRef<BookRef>(null);
  const compileOnFinish = useRef<boolean>(!actChapter.compilation);
  const [openBook, setOpenBook] = useState<boolean>(false);
  const [showFinishButton, setShowFinishButton] = useState<boolean>(
    actChapter.messages.length >= MIN_MESSAGES_TO_FINISH
  );

  return (
    <div className="flex size-full">
      <ChatUi
        actChapter={actChapter}
        onChangeMessages={(m) => {
          setShowFinishButton(m.length >= MIN_MESSAGES_TO_FINISH);
          compileOnFinish.current = true;
        }}
      />
      <button
        className={cn(
          "absolute text-xs right-5 top-1/2 -translate-y-1/2 rounded-full p-2 bg-green-200 cursor-pointer hover:bg-green-300 duration-200",
          showFinishButton ? "scale-100" : "scale-0"
        )}
        title="Finalizar capítulo"
        onClick={async () => {
          setOpenBook(true);
          if (compileOnFinish.current) {
            await bookRef?.current?.recompile();
            compileOnFinish.current = false;
          }
        }}
      >
        <ArrowBigRightDash className="size-8 text-gray-700" />
      </button>
      <div
        className={cn(
          "absolute flex size-full left-0 top-0 duration-500",
          openBook ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Book ref={bookRef} actChapter={actChapter} onClose={() => setOpenBook(false)} />
      </div>
    </div>
  );
}

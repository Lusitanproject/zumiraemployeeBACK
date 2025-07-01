"use client";

import { useRef, useState } from "react";

import { ChatUi } from "@/components/ui/act-chat/chat-ui";
import { cn } from "@/lib/utils";
import { ActChapter } from "@/types/acts";

import { Book, BookRef } from "./book";
import { Button } from "@/components/ui/button";

interface WhiteboardProps {
  actChapter: ActChapter;
}

export function Whiteboard({ actChapter }: WhiteboardProps) {
  const MIN_MESSAGES_TO_FINISH = 10;

  const bookRef = useRef<BookRef>(null);
  const compileOnFinish = useRef<boolean>(!actChapter.compilation);
  const [openBook, setOpenBook] = useState<boolean>(!!actChapter.compilation);
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
      <div
        className={cn("absolute flex justify-center w-full bottom-0 left-0 bg-gray-100 p-3 duration-500", {
          "translate-y-full": !showFinishButton,
        })}
      >
        <Button
          size="xl"
          variant="primary"
          onClick={async () => {
            setOpenBook(true);
            if (compileOnFinish.current) {
              await bookRef?.current?.recompile();
              compileOnFinish.current = false;
            }
          }}
        >
          Recompilar
        </Button>
      </div>

      <div
        className={cn(
          "absolute flex size-full left-0 top-0 duration-500",
          openBook ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Book ref={bookRef} actChapter={actChapter} />
      </div>
    </div>
  );
}

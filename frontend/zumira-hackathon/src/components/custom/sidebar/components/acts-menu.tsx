import { Plus } from "lucide-react";
import { IconName } from "lucide-react/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActsData } from "@/types/act";

import { ActItem } from "./act-item";

interface ActsMenuProps {
  data: ActsData;
  expanded: boolean;
}

export function ActsMenu({ data, expanded }: ActsMenuProps) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentChapterId = segments[2] ?? null;
  const currentActId = data.chapters.find((c) => c.id === currentChapterId)?.actChatbotId;

  const [openAct, setOpenAct] = useState<string | null>(currentActId ?? null);

  return (
    <>
      <Link className="flex w-full justify-center" href="/chat/novo">
        <Button size={expanded ? undefined : "icon"} variant="primary">
          <div className="flex flex-row gap-2 items-center">
            <Plus className="size-5 flex-none flex" />
            {expanded && (
              <>
                <span>Novo capítulo</span>
                <div className="size-5 flex-none flex" />
              </>
            )}
          </div>
        </Button>
      </Link>

      <div
        className={cn("flex flex-col h-full gap-1 overflow-y-scroll items-center", expanded ? "-mx-5" : "-mx-4")}
        style={{ scrollbarGutter: "stable both-edges" }}
      >
        {data.chatbots.map((bot) => (
          <ActItem
            key={bot.id}
            chapters={data.chapters.filter((conv) => conv.actChatbotId === bot.id)}
            currentChapterId={currentChapterId}
            expanded={expanded}
            icon={bot.icon as IconName}
            id={bot.id}
            locked={bot.locked}
            name={bot.name}
            open={openAct === bot.id}
            onClose={() => setOpenAct(null)}
            onOpen={(id) => setOpenAct(id)}
          />
        ))}
      </div>
    </>
  );
}

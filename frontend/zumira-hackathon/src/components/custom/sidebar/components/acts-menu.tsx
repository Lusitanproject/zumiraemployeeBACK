import { Plus } from "lucide-react";
import { IconName } from "lucide-react/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ActsData } from "@/types/acts";

import { ActItem } from "./act-item";

interface ActsMenuProps {
  data: ActsData;
}

export function ActsMenu({ data }: ActsMenuProps) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentConversationId = segments[2] ?? null;
  const currentActId = data.conversations.find((c) => c.id === currentConversationId)?.actChatbotId;

  return (
    <>
      <Link className="flex w-full justify-center" href="/chat/novo">
        <Button variant="primary">
          <div className="flex flex-row gap-2 items-center">
            <Plus className="size-5 flex-none flex" />
            <span>Novo capítulo</span>
            <div className="size-5 flex-none flex" />
          </div>
        </Button>
      </Link>
      <div className="flex flex-col gap-1">
        {data.chatbots.map((c) => (
          <ActItem
            key={c.id}
            conversations={data.conversations.filter((conv) => conv.actChatbotId === c.id)}
            currentConversationId={currentConversationId}
            defaultOpen={c.id === currentActId}
            icon={c.icon as IconName}
            name={c.name}
          />
        ))}
      </div>
      <hr className="text-gray-300" />
    </>
  );
}

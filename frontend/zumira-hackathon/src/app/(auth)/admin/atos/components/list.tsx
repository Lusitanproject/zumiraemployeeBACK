"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { updateManyActChatbots } from "@/api/acts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActChatbot } from "@/types/acts";

type ActsListProps = {
  data: ActChatbot[];
};

export function ActsList({ data }: ActsListProps) {
  const [chatbots, setChatbots] = useState<ActChatbot[]>(data);

  const orderBots = (a: ActChatbot, b: ActChatbot) => a.index - b.index;

  const debouncedSave = useDebouncedCallback(async (chatbots: ActChatbot[]) => {
    try {
      await updateManyActChatbots(chatbots.map((bot, index) => ({ ...bot, index })));
    } catch {
      toast.error("Erro ao salvar nova ordem dos atos.");
    }
  }, 3000);

  function moveUp(index: number) {
    if (index <= 0) return;

    setChatbots((prev) => {
      const updated = prev.toSorted(orderBots); // Garantir que nenhum está com o index repetido (feito por conta de uma migration do banco de dados)

      prev[index].index = index - 1;
      prev[index - 1].index = index;

      return updated;
    });

    debouncedSave(chatbots);
  }

  function moveDown(index: number) {
    if (index >= chatbots.length - 1) return;

    setChatbots((prev) => {
      const updated = prev.toSorted(orderBots);

      prev[index].index = index + 1;
      prev[index + 1].index = index;

      return updated;
    });

    debouncedSave(chatbots);
  }

  return (
    <div className="flex flex-col py-4 gap-2.5">
      {chatbots.sort(orderBots).map((item, index) => (
        <div
          key={item.id}
          className={cn("flex flex-row items-center justify-between rounded-xl bg-background-100 duration-500 p-4")}
        >
          <Link className="flex flex-row gap-4 items-center w-full" href={`/admin/atos/${item.id}`}>
            <span className="text-text-400 text-lg">#{index + 1}</span>
            <div className="flex justify-start">
              <div className="size-[50px] rounded-xl bg-primary-50 flex items-center justify-center">
                <DynamicIcon className="size-6" name={item.icon as IconName} />
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-medium text-text-700 mb-1">{item.name}</h3>
              <p className="w-full h-fit overflow-hidden text-ellipsis text-xs font-normal text-text-900">
                {item.description}
              </p>
            </div>
          </Link>
          <div className="flex flex-col gap-1">
            <Button className="bg-background-100" disabled={index === 0} size="icon" onClick={() => moveUp(index)}>
              <ChevronUp className="size-6" />
            </Button>
            <Button
              className="bg-background-100"
              disabled={index + 1 === chatbots.length}
              size="icon"
              onClick={() => moveDown(index)}
            >
              <ChevronDown className="size-6" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

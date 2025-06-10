"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { reorderChatbots } from "../actions";
import { ActChatbot } from "../definitions";

type ActsListProps = {
  data: ActChatbot[];
};

export function ActsList({ data }: ActsListProps) {
  const [chatbots, setChatbots] = useState<ActChatbot[]>(data);

  const debouncedSave = useDebouncedCallback(async (chatbots: ActChatbot[]) => {
    try {
      await reorderChatbots(chatbots);
    } catch {
      toast.error("Erro ao salvar nova ordem dos atos");
    }
  }, 3000);

  function updateOrder(chatbots: ActChatbot[]) {
    for (let i = 0; i < chatbots.length; i++) {
      const curr = chatbots[i];
      const next = chatbots[i + 1];
      curr.nextActChatbotId = next ? next.id : null;
    }

    debouncedSave(chatbots);
  }

  function moveUp(index: number) {
    if (index <= 0) return;

    setChatbots((prev) => {
      const updated = [...prev];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      updateOrder(updated);
      return updated;
    });
  }

  function moveDown(index: number) {
    setChatbots((prev) => {
      if (index >= prev.length - 1) return prev;

      const updated = [...prev];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      updateOrder(updated);
      return updated;
    });
  }

  return (
    <div className="flex flex-col py-4 gap-2.5">
      {chatbots.map((item, index) => (
        <div
          key={item.id}
          className={cn("flex flex-row items-center justify-between rounded-xl bg-gray-100 duration-500 p-4")}
        >
          <Link className="flex flex-row gap-4 items-center w-full" href={`/admin/atos/${item.id}`}>
            <span className="text-gray-400 text-lg">#{index + 1}</span>
            <div className="flex justify-start">
              <div className="size-[50px] rounded-xl bg-primary-50 flex items-center justify-center">
                <DynamicIcon className="size-6" name={item.icon as IconName} />
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-medium text-gray-700 mb-1">{item.name}</h3>
              <p className="w-full h-fit overflow-hidden text-ellipsis text-xs font-normal text-gray-900">
                {item.description}
              </p>
            </div>
          </Link>
          <div className="flex flex-col gap-1">
            <Button className="bg-gray-100" disabled={index === 0} size="icon" onClick={() => moveUp(index)}>
              <ChevronUp className="size-6" />
            </Button>
            <Button
              className="bg-gray-100"
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

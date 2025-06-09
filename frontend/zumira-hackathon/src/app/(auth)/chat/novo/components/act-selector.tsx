"use client";

import { ActsData } from "@/types/acts";
import { ChevronDown } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { newConversation } from "../actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface ActSelectorProps {
  data: ActsData;
}

export function ActSelector({ data }: ActSelectorProps) {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [selected, setSelected] = useState<ActsData["chatbots"][0]>(data.chatbots[0]!);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleConfirm() {
    setLoading(true);

    try {
      await newConversation(selected.id);
    } catch (error) {
      if (!isRedirectError(error) && error instanceof Error) toast.error(error.message);
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-start w-full flex-none h-full gap-6 py-4 mt-32", "px-48")}>
      <div className="flex flex-col gap-2 items-center justify-end">
        <div className="rounded-full border-2 border-gray-200 p-4 size-18 flex-none">
          <DynamicIcon className="size-full text-gray-700" name={selected.icon as IconName} />
        </div>

        <div className="flex flex-col relative">
          <div className="flex flex-row items-end justify-center gap-2">
            <div className="flex-none size-6" />
            <span className="text-2xl font-semibold text-gray-700">{selected.name}</span>
            <ChevronDown
              className="flex-none size-6 cursor-pointer text-gray-400"
              onClick={() => setOpenDropdown((prev) => !prev)}
            />
          </div>

          <div
            className={cn(
              "absolute flex flex-col justify-center items-center -translate-x-1/2 left-1/2 top-[110%] rounded-xl bg-white border-1 border-gray-300 w-fit overflow-clip duration-200 shadow-md py-2",
              openDropdown
                ? "opacity-100 pointer-events-auto translate-y-0"
                : "opacity-0 pointer-events-none -translate-y-2"
            )}
          >
            {data.chatbots.map((bot) => (
              <div
                className="flex flex-row gap-2 items-center w-full text-center text-lg hover:bg-black/5 px-3 py-1.5 cursor-pointer text-gray-500 text-nowrap"
                key={bot.id}
                onClick={() => {
                  setSelected(bot);
                  setOpenDropdown(false);
                }}
              >
                <DynamicIcon className="size-4" name={bot.icon as IconName} />
                <span>{bot.name}</span>
              </div>
            ))}
          </div>
        </div>

        <span className="text-gray-500">{selected.description}</span>
      </div>
      {/* <MessageInput placeholder="Comece a escrever seu próximo capítulo" /> */}
      <Button variant="primary" size="xxl" onClick={handleConfirm} disabled={loading} loading={loading}>
        Iniciar capítulo
      </Button>
    </div>
  );
}

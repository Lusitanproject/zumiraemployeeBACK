"use client";

import { BotMessageSquare, Maximize2, Minimize2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Chat } from "@/components/ui/chat/chat";
import { ChatMessage } from "@/components/ui/chat/definitions";
import { cn } from "@/lib/utils";

import icon from "../../../../icon.png";
import { CompanyFeedback } from "./definitions";

interface AssistantProps {
  chatbotId: string;
  companyFeedbacks: CompanyFeedback[];
  username: string;
}

export function Assistant({ companyFeedbacks, username, chatbotId }: AssistantProps) {
  const context = companyFeedbacks.map((f) => ({
    content: `TESTE: ${f.assessment.title}\nRESULTADO/DEVOLUTIVA: ${f.text}\nTOTAL DE RESPONDENTES: ${f.respondents}`,
    role: "user",
  })) as ChatMessage[];

  const [open, setOpen] = useState<boolean>(false);
  const [maximize, setMaximize] = useState<boolean>(false);

  function closeChat() {
    setOpen(false);
    setMaximize(false);
  }

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <div
        className={cn(
          "absolute flex bottom-0 right-0 md:-translate-x-5 -translate-x-2 size-18 rounded-full pointer-events-auto bg-primary-300 justify-center items-center cursor-pointer shadow-xl duration-300",
          open ? "md:translate-y-1/12 -translate-y-24 opacity-0" : "md:-translate-y-5 -translate-y-32 opacity-100"
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <BotMessageSquare className="size-9 text-white" />
      </div>
      <section
        className={cn(
          "absolute flex flex-col bottom-0 right-0 bg-white overflow-hidden border-1 border-gray-300 duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-1/3",
          maximize
            ? "size-full"
            : "size-full md:h-[75vh] md:w-[26rem] md:-translate-x-5 md:-translate-y-5 md:rounded-lg"
        )}
      >
        <header className="bg-gray-100 p-3 border-b-1 border-gray-300 flex flex-row justify-between text-gray-900">
          <button onClick={closeChat}>
            <X className="size-6 cursor-pointer" />
          </button>
          <h1 className="font-bold">Zumira analytics</h1>
          <button
            className="opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
            onClick={() => setMaximize((prev) => !prev)}
          >
            {maximize ? (
              <Minimize2 className="size-6 cursor-pointer" />
            ) : (
              <Maximize2 className="size-6 cursor-pointer" />
            )}
          </button>
        </header>
        <div className="flex flex-col flex-1 min-h-0">
          <Chat chatbotId={chatbotId} context={context} username={username}>
            <div className="flex flex-col justify-center items-center size-full gap-3">
              <p className="text-center text-gray-500">Consulte aqui os indicadores da sua empresa</p>
              <div className="absolute size-24">
                <Image fill alt="icon zumira" className="opacity-10" src={icon} />
              </div>
            </div>
          </Chat>
        </div>
      </section>
    </div>
  );
}

"use client";

import { ChevronDown } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActsData } from "@/types/act";

import { newChapter } from "../actions";

interface ActSelectorProps {
  data: ActsData;
}

export function ActSelector({ data }: ActSelectorProps) {
  const searchParams = useSearchParams();
  const defaultActId = searchParams.get("default") || undefined;

  const findActById = useCallback(
    (id?: string) => data.chatbots.find((c) => (id ? c.id === id : c.current)) ?? data.chatbots[0]!,
    [data.chatbots]
  );

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [selected, setSelected] = useState<ActsData["chatbots"][0]>(findActById(defaultActId));
  const [loading, setLoading] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    }

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  useEffect(() => {
    setSelected(findActById(defaultActId));
  }, [defaultActId, findActById]);

  async function handleConfirm() {
    setLoading(true);

    try {
      await newChapter(selected.id);
    } catch (error) {
      if (!isRedirectError(error)) {
        setLoading(false);
        if (error instanceof Error) toast.error(error.message);
      }
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-start size-full gap-6 py-4 px-0 md:px-48 mt-32")}>
      <div className="flex flex-col gap-2 items-center justify-end">
        <div className="rounded-full border-2 border-border-200 p-4 size-18 flex-none">
          <DynamicIcon className="size-full text-text-700" name={selected.icon as IconName} />
        </div>

        <div className="flex flex-col relative">
          <div className="flex flex-row items-end justify-center gap-2">
            <div className="flex-none size-6" />
            <div
              className="flex flex-row gap-2 items-center cursor-pointer"
              onClick={() => setOpenDropdown((prev) => !prev)}
            >
              <span className="text-2xl font-semibold text-text-700 text-center">{selected.name}</span>
              <ChevronDown className="flex-none size-6 text-text-400" />
            </div>
          </div>

          <div
            ref={dropdownRef}
            className={cn(
              "absolute flex flex-col justify-center items-center z-30 -translate-x-1/2 left-1/2 top-[110%] rounded-xl bg-background-0 border-1 border-border-300 w-fit overflow-clip duration-200 shadow-md py-2",
              openDropdown
                ? "opacity-100 pointer-events-auto translate-y-0"
                : "opacity-0 pointer-events-none -translate-y-2"
            )}
          >
            {data.chatbots.map((bot) => (
              <div
                key={bot.id}
                className={cn(
                  "flex flex-row gap-2 items-center w-full text-center text-lg hover:bg-background-50 px-3 py-1.5 cursor-pointer text-text-500 text-nowrap",
                  { "opacity-50": bot.locked, "font-semibold": bot.id === selected.id }
                )}
                onClick={() => {
                  if (!bot.locked) {
                    setSelected(bot);
                    setOpenDropdown(false);
                  } else {
                    toast.warning("Finalize os atos anteriores para desbloquear este.");
                  }
                }}
              >
                <DynamicIcon
                  className="size-4"
                  name={bot.locked ? "lock" : (bot.icon as IconName)}
                  strokeWidth={bot.id === selected.id ? 3 : undefined}
                />
                <span>{bot.name}</span>
              </div>
            ))}
          </div>
        </div>

        <span className="text-text-500 text-center">{selected.description}</span>
      </div>
      {/* <MessageInput placeholder="Comece a escrever seu próximo capítulo" /> */}
      <Button disabled={loading} loading={loading} size="xxl" variant="primary" onClick={handleConfirm}>
        Iniciar capítulo
      </Button>
    </div>
  );
}

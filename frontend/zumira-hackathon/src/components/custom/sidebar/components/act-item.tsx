"use client";

import { ChevronDown } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { ActsData } from "@/types/acts";

interface ActItemProps {
  conversations: ActsData["conversations"];
  currentConversationId: string | null;
  defaultOpen: boolean;
  icon: IconName;
  name: string;
}

export function ActItem({ icon, name, conversations, defaultOpen, currentConversationId }: ActItemProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const isActiveConversation = conversations.some((c) => c.id === currentConversationId);
  const textColor = isActiveConversation ? "text-gray-500" : "text-gray-400";

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownHeight, setDropdownHeight] = useState<number>(0);

  useEffect(() => {
    setDropdownHeight(dropdownRef.current && open ? dropdownRef.current.offsetHeight : 0);
  }, [open]);

  return (
    <div className="flex flex-col w-full ">
      <div
        className={cn(
          "flex flex-row justify-between cursor-pointer items-center w-full h-11 px-5 hover:bg-black/5 rounded-xl group",
          textColor
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex flex-row gap-2 w-full items-center overflow-hidden">
          <DynamicIcon className={cn("size-5 flex-none", textColor)} name={icon} />
          <span className={cn("text-nowrap text-ellipsis overflow-hidden text-sm font-semibold")}>{name}</span>
        </div>
        <ChevronDown
          className={cn(
            "size-5 flex-none duration-300 transition-transform hidden group-hover:flex",
            open ? "rotate-0" : "-rotate-180"
          )}
        />
      </div>
      <div className={cn("relative flex duration-300 overflow-clip")} style={{ height: dropdownHeight }}>
        <div ref={dropdownRef} className="absolute flex flex-col w-full">
          {conversations.map((c) => (
            <Link
              key={c.id}
              className={cn(
                "text-sm px-7 py-2 rounded-xl hover:bg-black/5 cursor-pointer w-full",
                currentConversationId === c.id ? "text-gray-500 font-medium" : "text-gray-400"
              )}
              href={`/chat/${c.id}`}
            >
              {c.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

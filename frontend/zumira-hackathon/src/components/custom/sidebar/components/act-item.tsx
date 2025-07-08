"use client";

import { ChevronDown } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { ActsData } from "@/types/act";

interface ActItemProps {
  chapters: ActsData["chapters"];
  currentChapterId: string | null;
  expanded: boolean;
  icon: IconName;
  id: string;
  locked: boolean;
  name: string;
  open: boolean;
  onClose: () => void;
  onOpen: (actChatbotId: string) => void;
}

export function ActItem({
  id,
  icon,
  name,
  chapters,
  currentChapterId,
  open,
  locked,
  expanded,
  onOpen,
  onClose,
}: ActItemProps) {
  const router = useRouter();

  const isActiveChapter = chapters.some((c) => c.id === currentChapterId);
  const textColor = isActiveChapter ? "text-text-500" : "text-text-400";

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownHeight, setDropdownHeight] = useState<number>(0);

  function handleClick() {
    if (!locked) {
      if (chapters.length) {
        if (open) {
          onClose?.();
        } else {
          onOpen?.(id);
        }
      } else {
        router.push(`/chat/novo?default=${id}`);
      }
    } else {
      toast.warning("Finalize os atos anteriores para desbloquear este.");
    }
  }

  useEffect(() => {
    setDropdownHeight(
      dropdownRef.current && open && expanded && chapters.length ? dropdownRef.current.offsetHeight : 0
    );
  }, [open, expanded, currentChapterId, chapters.length]);

  return (
    <div className="flex flex-col w-full ">
      <div
        className={cn(
          "flex flex-row justify-between items-center w-full h-11 rounded-xl",
          locked ? "opacity-50 cursor-default" : "cursor-pointer hover:bg-black/5 group",
          textColor,
          {
            "px-5": expanded,
          }
        )}
        onClick={handleClick}
      >
        <div
          className={cn("flex flex-row gap-2 w-full items-center overflow-hidden", {
            "justify-center": !expanded,
          })}
        >
          <DynamicIcon className={cn("size-5 flex-none", textColor)} name={locked ? "lock-keyhole" : icon} />
          {expanded && (
            <span className={cn("text-nowrap text-ellipsis overflow-hidden text-sm font-semibold")}>{name}</span>
          )}
        </div>
        {expanded && (
          <ChevronDown
            className={cn(
              "size-5 flex-none duration-300 transition-transform hidden",
              open ? "rotate-0" : "-rotate-180",
              {
                "group-hover:flex": chapters.length,
              }
            )}
          />
        )}
      </div>

      <div className={cn("relative flex duration-300 overflow-clip")} style={{ height: dropdownHeight }}>
        <div ref={dropdownRef} className="absolute flex flex-col w-full">
          {chapters.map((c) => (
            <Link
              key={c.id}
              className={cn(
                "text-sm px-7 py-2 rounded-xl hover:bg-black/5 cursor-pointer w-full text-ellipsis text-nowrap overflow-hidden",
                currentChapterId === c.id ? "text-text-500 font-medium" : "text-text-400"
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

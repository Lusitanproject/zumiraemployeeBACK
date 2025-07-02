"use client";

import { ChevronDown } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { ActsData } from "@/types/acts";

interface ActItemProps {
  chapters: ActsData["chapters"];
  currentChapterId: string | null;
  defaultOpen: boolean;
  icon: IconName;
  locked: boolean;
  name: string;
}

export function ActItem({ icon, name, chapters, defaultOpen, currentChapterId, locked }: ActItemProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const isActiveChapter = chapters.some((c) => c.id === currentChapterId);
  const textColor = isActiveChapter ? "text-text-500" : "text-text-400";

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownHeight, setDropdownHeight] = useState<number>(0);

  useEffect(() => {
    setDropdownHeight(dropdownRef.current && open ? dropdownRef.current.offsetHeight : 0);
  }, [open]);

  return (
    <div className="flex flex-col w-full ">
      <div
        className={cn(
          "flex flex-row justify-between items-center w-full h-11 px-5 rounded-xl",
          locked ? "opacity-50 cursor-default" : "cursor-pointer hover:bg-black/5 group",
          textColor
        )}
        onClick={() => {
          if (!locked) {
            setOpen((prev) => !prev);
          } else {
            toast.warning("Finalize os atos anteriores para desbloquear este.");
          }
        }}
      >
        <div className="flex flex-row gap-2 w-full items-center overflow-hidden">
          <DynamicIcon className={cn("size-5 flex-none", textColor)} name={locked ? "lock-keyhole" : icon} />
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
          {chapters.map((c) => (
            <Link
              key={c.id}
              className={cn(
                "text-sm px-7 py-2 rounded-xl hover:bg-black/5 cursor-pointer w-full",
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

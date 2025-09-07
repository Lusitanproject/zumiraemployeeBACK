"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ActsData } from "@/types/act";

type MyStoryProps = {
  data: ActsData;
};

export function MyStory({ data }: MyStoryProps) {
  return (
    <Link href={"/minha-historia"}>
      <button
        className={cn(
          "relative flex justify-center items-center overflow-clip px-3 py-1.5 border-1 border-border-300 duration-200 cursor-pointer rounded-xl"
        )}
      >
        <div className={cn("flex flex-row gap-1 items-center")}>
          <Bookmark className="text-primary-400 size-4.5" />
          <span className="text-text-700">Minha história</span>
        </div>
        <div
          className="absolute h-0.5 bg-primary-400 bottom-0 left-0 duration-1000"
          style={{ width: `${data.progress * 100}%` }}
        />
      </button>
    </Link>
  );
}

"use client";

import { Bookmark } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { ActsData } from "@/types/act";

type MyStoryProps = {
  data: ActsData;
};

export function MyStory({ data }: MyStoryProps) {
  const disabled = data.progress < 1;

  return (
    <button
      className={cn(
        "relative flex justify-center items-center overflow-clip px-3 py-1.5 border-1 border-border-300 duration-200 cursor-pointer rounded-xl",
        {
          "hover:border-primary-400 hover:bg-background-50": !disabled,
        }
      )}
      onClick={() => {
        if (disabled) {
          toast.warning("Complete todos os atos para ver a sua história completa!");
        } else {
          redirect("/minha-historia");
        }
      }}
    >
      <div className={cn("flex flex-row gap-1 items-center", { "grayscale-100 opacity-60": disabled })}>
        <Bookmark className="text-primary-400 size-4.5" />
        <span className="text-text-700">Minha história</span>
      </div>
      {disabled && (
        <div
          className="absolute h-0.5 bg-primary-400 bottom-0 left-0 duration-1000"
          style={{ width: `${data.progress * 100}%` }}
        />
      )}
    </button>
  );
}

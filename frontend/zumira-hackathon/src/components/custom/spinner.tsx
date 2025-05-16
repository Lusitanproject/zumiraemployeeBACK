import { cn } from "@/lib/utils";
import React from "react";

type SpinnerSize = "sm" | "md" | "lg" | "xl" | "xxl" | "icon" | null | undefined;

interface SpinnerProps {
  size?: SpinnerSize;
}

export function Spinner({ size }: SpinnerProps) {
  const sizeMap: Record<Exclude<SpinnerSize, null | undefined>, string> = {
    sm: "w-3 h-3 border-[2px]",
    md: "w-4 h-4 border-[2.5px]",
    lg: "w-5 h-5 border-[2.5px]",
    xl: "w-6 h-6 border-[3px]",
    xxl: "w-7 h-7 border-[3px]",
    icon: "w-4 h-4 border-[2.5px]",
  };

  return (
    <span
      className={cn("flex-none border-white rounded-full border-b-transparent animate-spin", sizeMap[size || "md"])}
    />
  );
}

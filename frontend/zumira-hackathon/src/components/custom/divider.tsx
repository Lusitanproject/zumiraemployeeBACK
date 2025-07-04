import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return <div className={cn("bg-background-300", className, "w-[1px] h-full")} />;
}

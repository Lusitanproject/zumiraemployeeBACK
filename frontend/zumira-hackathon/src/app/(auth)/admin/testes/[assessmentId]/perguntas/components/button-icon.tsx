import { MouseEventHandler, ReactNode } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ButtonProps = {
  children: ReactNode;
  tooltip: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export function ButtonIcon({ children, tooltip, onClick, disabled }: ButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="w-10 h-10 border border-border-300 text-text-700 bg-background-0 rounded flex items-center justify-center disabled:bg-background-25 disabled:border-border-200 disabled:text-text-400"
            disabled={disabled}
            onClick={onClick}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

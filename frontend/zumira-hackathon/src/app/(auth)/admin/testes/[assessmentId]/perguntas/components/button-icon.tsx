import { MouseEventHandler, ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ButtonProps = {
  children: ReactNode
  tooltip: string
  onClick: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

export function ButtonIcon({ children, tooltip, onClick, disabled }: ButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            disabled={disabled}
            className="w-10 h-10 border border-gray-300 bg-white rounded flex items-center justify-center disabled:bg-gray-25 disabled:border-gray-200 disabled:text-gray-400"
            onClick={onClick}
          >{children}</button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

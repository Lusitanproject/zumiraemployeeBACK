import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:shadow-focus-ring disabled:bg-primary-200",
        secondary: "bg-primary-50 text-primary-700 hover:bg-primary-100 focus:shadow-focus-ring disabled:bg-primary-25 disabled:text-primary-300",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:shadow-focus-ring disabled:border-gray-200 disabled:text-gray-300",
        danger: "bg-error-600 text-white hover:bg-error-700 focus:shadow-focus-ring disabled:bg-error-200",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded-xl gap-2 px-[0.875rem] text-sm font-semibold",
        md: "h-10 rounded-xl gap-2 px-4 text-sm font-semibold",
        lg: "h-[2.75rem] rounded-xl px-[1.125rem] gap-[0.875rem] text-base font-semibold",
        xl: "h-12 rounded-xl gap-2 px-5 text-base font-semibold",
        xxl: "h-[3.75rem] rounded-xl gap-2 px-7 text-lg font-semibold",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

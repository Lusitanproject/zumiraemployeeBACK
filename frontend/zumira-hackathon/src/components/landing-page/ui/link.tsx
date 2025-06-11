import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"
import { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const linkVariants = cva(
  "flex items-center justify-center h-12 rounded-[1.5rem] gap-x-2 px-6 whitespace-nowrap text-base font-bold transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary: "bg-zumira-green text-white hover:bg-primary-700 focus:shadow-focus-ring disabled:bg-primary-200",
        secondary: "bg-primary-50 text-primary-700 hover:bg-primary-100 focus:shadow-focus-ring disabled:bg-primary-25 disabled:text-primary-300",
        outline: "border border-gray-500 text-gray-500 hover:bg-gray-50 focus:shadow-focus-ring disabled:border-gray-200 disabled:text-gray-300",
        danger: "bg-error-600 text-white hover:bg-error-700 focus:shadow-focus-ring disabled:bg-error-200",
        link: "text-primary underline-offset-4 hover:underline",
        alternate: "bg-primary-200 text-white hover:bg-primary-300 focus:shadow-focus-ring disabled:bg-primary-50",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

function AppLink({
  variant,
  className,
  href,
  ...props
}: ComponentProps<"a"> &
  VariantProps<typeof linkVariants>) {

  return (
    <Link legacyBehavior passHref href={href || ""}>
      <a
        className={cn(linkVariants({ variant, className }))}
        data-slot="button"
        {...props}
      />
    </Link>
  )
}

export { AppLink, linkVariants }
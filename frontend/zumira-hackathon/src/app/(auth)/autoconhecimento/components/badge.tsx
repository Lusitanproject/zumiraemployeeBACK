import { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "text-xs rounded-2xl px-2 h-[1.125rem] bg-gray-100 flex items-center flex-nowrap whitespace-nowrap gap-x-1 cursor-pointer",
  {
    variants: {
      selected: {
        true: "bg-primary-25 text-primary-700",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

export function Badge({
  className,
  selected = false,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof badgeVariants>) {
  return <button className={cn(badgeVariants({ selected, className }))} {...props} />;
}

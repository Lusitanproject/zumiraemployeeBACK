import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-11 w-full min-w-0 rounded-lg border border-border-300 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border-300 disabled:bg-background-50 disabled:text-text-500/60 focus-visible:border-primary-300 focus-visible:shadow-focus-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive leading-6",
  {
    variants: {
      hasIcon: {
        true: "pl-11",
      },
      hasError: {
        true: "border-error-300 focus-visible:border-error-300 focus-visible:shadow-error-ring",
      },
    },
    defaultVariants: {
      hasIcon: false,
    },
  }
);

interface InputProps extends React.ComponentProps<"input">, VariantProps<typeof inputVariants> {
  icon?: React.ElementType;
}

function Input({ className, type, hasIcon = false, hasError = false, icon: Icon, ...props }: InputProps) {
  const shouldShowIcon = hasIcon || !!Icon;

  return (
    <div className="w-full h-fit relative text-text-700 placeholder:text-text-400">
      {shouldShowIcon && Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-500 pointer-events-none z-10">
          <Icon size={20} strokeWidth={1.5} />
        </div>
      )}
      <input
        className={cn(inputVariants({ hasIcon: shouldShowIcon, hasError, className }))}
        data-slot="input"
        type={type}
        {...props}
      />
    </div>
  );
}

export { Input };

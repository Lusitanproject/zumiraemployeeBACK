"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "relative inline-flex items-center justify-center size-5 rounded border border-border-300 bg-background-0 transition-colors focus-within:border-primary-300 focus-within:shadow-focus-ring disabled:bg-background-100 disabled:border-border-200",
        className
      )}
    >
      <input
        className="peer absolute opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed"
        type="checkbox"
        {...props}
      />
      <span
        className={cn(
          "pointer-events-none flex items-center justify-center w-full h-full rounded transition-[background,border]",
          "peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:ring-2 peer-checked:ring-primary-600"
        )}
      >
        <div className="size-2 rounded-full bg-primary-600 peer-checked:opacity-100 opacity-0 transition-opacity duration-150" />
      </span>
    </label>
  );
}

export { Checkbox };

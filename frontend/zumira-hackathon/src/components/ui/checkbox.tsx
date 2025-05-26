"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "relative inline-flex items-center justify-center size-5 rounded border border-gray-300 bg-white transition-colors focus-within:border-primary-300 focus-within:shadow-focus-ring disabled:bg-gray-100 disabled:border-gray-200",
        className
      )}
    >
      <input
        type="checkbox"
        className="peer absolute opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed"
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

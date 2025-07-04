"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} data-slot="radio-group" {...props} />;
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "size-5 border border-border-300 rounded-full bg-background-0 focus-visible:border-primary-300 focus-visible:shadow-focus-ring disabled:bg-background-100 disabled:border-border-200 shrink-0 aspect-square transition=[color, box-shadow] outline-none disabled:cursor-not-allowed aria-checked:border-primary-600",
        className
      )}
      data-slot="radio-group-item"
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className="relative w-full h-full rounded-full flex items-center justify-center bg-primary-50 border-primary-600"
        data-slot="radio-group-indicator"
      >
        <CircleIcon className="fill-primary-600 stroke-primary-600 absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };

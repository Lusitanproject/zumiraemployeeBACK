"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Define estado inicial baseado na classe no html
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <button className={cn("flex items-center p-1 w-[2.8rem] h-6 bg-background-200 rounded-full")} onClick={toggle}>
      <div className="relative flex size-full items-center justify-between">
        <Moon className="size-4 text-blue-200" fill="oklch(0.882 0.059 254.128)" />
        <Sun className="size-4 text-yellow-500" fill="oklch(0.795 0.184 86.047)" />
        <div
          className={cn(
            "absolute bg-white size-4.5 rounded-full z-10 duration-300",
            isDark ? "left-full -translate-x-full" : "left-0 translate-x-0"
          )}
        />
      </div>
    </button>
  );
}

"use client";
import { useCallback, useRef, useState } from "react";
import { AvatarDropdown } from "./avatar-dropdown";

type AvatarThumb = {
  user: string;
  role: string;
};

export function AvatarThumb({ user, role }: AvatarThumb) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleClickOutside = useCallback(() => {
    setOpen(false);
  }, []);

  const handleToggleDropdown = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  return (
    <div ref={ref} className="relative w-12 h-12 md:w-11 md:h-11">
      <div
        className={`overflow-hidden rounded-full w-12 h-12 md:w-11 md:h-11 md:border-2 md:border-white md:shadow-lg bg-primary-400 flex items-center justify-center relative ${
          open ? "z-50" : "z-auto"
        }`}
        onClick={handleToggleDropdown}
      >
        <span className="font-bold text-sm text-white">
          {user
            .split(" ")
            .filter((_, index) => index < 2)
            .map((item) => item[0])}
        </span>
      </div>
      <AvatarDropdown userRole={role} open={open} onClose={handleClickOutside} />
    </div>
  );
}

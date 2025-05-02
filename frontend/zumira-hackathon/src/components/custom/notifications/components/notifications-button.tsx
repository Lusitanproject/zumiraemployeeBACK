"use client";

import { Bell } from "lucide-react";
import { NotificationsDropdown } from "./notifications-dropdown";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Notification } from "../definitions";

interface NotificationsButtonProps {
  data: Notification[];
}

export function NotificationsButton({ data }: NotificationsButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className={cn(
          "flex justify-center items-center w-11 h-11 cursor-pointer rounded-full bg-white relative",
          isDropdownOpen ? "z-50" : "z-auto"
        )}
      >
        <Bell size={24} className="text-gray-400" />
      </button>
      {isDropdownOpen && <NotificationsDropdown data={data} onClose={() => setIsDropdownOpen(false)} />}
    </div>
  );
}

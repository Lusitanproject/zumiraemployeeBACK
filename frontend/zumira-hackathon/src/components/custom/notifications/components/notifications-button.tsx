"use client";

import { Bell } from "lucide-react";
import { NotificationsDropdown } from "./notifications-dropdown";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Alert, Notification } from "../definitions";

interface NotificationsButtonProps {
  notifications: Notification[];
  alerts: Alert[];
}

export function NotificationsButton({ notifications, alerts }: NotificationsButtonProps) {
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
      {isDropdownOpen && (
        <NotificationsDropdown notifications={notifications} alerts={alerts} onClose={() => setIsDropdownOpen(false)} />
      )}
    </div>
  );
}

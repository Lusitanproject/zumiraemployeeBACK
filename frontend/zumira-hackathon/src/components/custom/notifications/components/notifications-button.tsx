"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Alert, Notification } from "../definitions";
import { NotificationsDropdown } from "./notifications-dropdown";

interface NotificationsButtonProps {
  alerts: Alert[];
  notifications: Notification[];
}

export function NotificationsButton({ notifications, alerts }: NotificationsButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        className={cn(
          "flex justify-center items-center w-11 h-11 cursor-pointer rounded-full bg-white relative",
          isDropdownOpen ? "z-50" : "z-auto"
        )}
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <Bell className="text-gray-400" size={24} />
      </button>
      {isDropdownOpen && (
        <NotificationsDropdown alerts={alerts} notifications={notifications} onClose={() => setIsDropdownOpen(false)} />
      )}
    </div>
  );
}

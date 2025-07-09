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

  const sortedAlerts = alerts.toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const sortedNotifications = notifications.toSorted(
    (a, b) =>
      b.notificationType.priority - a.notificationType.priority ||
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );
  // Pega a cor do primeiro alerta ou notificação
  const dotColor =
    sortedAlerts[0]?.assessmentResultRating.color ??
    sortedNotifications[0]?.notificationType.color ??
    "oklch(0.704 0.191 22.216)";

  return (
    <div className="relative">
      <button
        className={cn(
          "flex justify-center items-center w-11 h-11 cursor-pointer rounded-full bg-background-0 relative",
          isDropdownOpen ? "z-50" : "z-auto"
        )}
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <Bell className="text-text-400" size={24} />
      </button>
      {isDropdownOpen && (
        <NotificationsDropdown alerts={alerts} notifications={notifications} onClose={() => setIsDropdownOpen(false)} />
      )}
      {!!(notifications.length + alerts.length) && (
        <div
          className={cn("absolute size-2 rounded-full top-2 right-3", {
            "z-50": isDropdownOpen,
          })}
          style={{ backgroundColor: dotColor }}
        />
      )}
    </div>
  );
}

"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { readNotification } from "../actions";
import { Notification } from "../definitions";

interface NotificationCardProps {
  notification: Notification;
  selected?: boolean;
  onClose?: () => void;
}

export function NotificationCard({ notification, selected, onClose }: NotificationCardProps) {
  function formatDate(dateInput: Date | string | number): string {
    const date = new Date(dateInput);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  }

  return (
    <Link
      href={notification.actionUrl ?? `/notificacoes?id=${notification.id}`}
      onClick={() => {
        readNotification(notification.id);
        onClose?.();
      }}
    >
      <section
        className={cn(
          "relative flex flex-col gap-1 p-3 rounded-md  border-gray-100 border-1",
          selected ? "bg-[#E7F8EA]" : "hover:bg-[#E7F8EA]"
        )}
      >
        <h1 className="text-gray-500 text-xs leading-[1.125rem] text-start">{notification.title}</h1>
        <hr className="text-gray-200" />
        <p className="text-gray-700 text-sm leading-5 text-start">{notification.summary}</p>
        <span className="flex w-full text-[10px] leading-[18px] text-right text-gray-400 justify-end">
          {formatDate(notification.receivedAt)}
        </span>
        <span className="w-full text-xs leading-[18px] underline text-gray-400 text-star">Ver mais</span>

        {!notification.read && (
          <div
            className="absolute right-0 top-0 -translate-y-1/3 rounded-full size-2 border-1 border-gray-200"
            style={{ backgroundColor: notification.notificationType.color }}
          />
        )}
      </section>
    </Link>
  );
}

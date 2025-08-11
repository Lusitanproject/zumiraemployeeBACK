"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { readNotification } from "@/api/notifications";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";

interface NotificationCardProps {
  notification: Notification;
  selected?: boolean;
  onClose?: () => void;
}

export function NotificationCard({ notification, selected, onClose }: NotificationCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  function formatDate(dateInput: Date | string | number): string {
    const date = new Date(dateInput);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio === 1.0) {
          readNotification(notification.id);
        }
      },
      { threshold: 1.0 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [notification.id]);

  return (
    <Link
      href={notification.actionUrl ?? `/notificacoes?id=${notification.id}`}
      onClick={() => {
        readNotification(notification.id);
        onClose?.();
      }}
    >
      <section
        ref={cardRef}
        className={cn(
          "relative flex flex-col gap-1 p-3 rounded-md border-border-100 border-1",
          selected ? "bg-background-50" : "hover:bg-background-50"
        )}
      >
        <h1 className="text-text-500 text-xs leading-[1.125rem] text-start">{notification.title}</h1>
        <hr className="text-text-200" />
        <p className="text-text-700 text-sm leading-5 text-start">{notification.summary}</p>
        <span className="flex w-full text-[10px] leading-[18px] text-right text-text-400 justify-end">
          {formatDate(notification.receivedAt)}
        </span>
        <span className="w-full text-xs leading-[18px] underline text-text-400 text-star">Ver mais</span>

        {!notification.read && (
          <div
            className="absolute right-0 top-0 -translate-y-1/3 rounded-full size-2 border-1 border-border-200"
            style={{ backgroundColor: notification.notificationType.color }}
          />
        )}
      </section>
    </Link>
  );
}

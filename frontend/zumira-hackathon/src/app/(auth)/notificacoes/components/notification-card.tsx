"use client";

import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import { Notification } from "../definitions";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "@/utils/is-mobile";

interface NotificationCardProps {
  notification: Notification;
  id?: string;
  open?: boolean;
  onOpen?: (id: string) => void;
  onClose?: (id: string) => void;
}

export function NotificationCard({ notification, id, open, onOpen, onClose }: NotificationCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>();

  function formatDate(dateInput: Date | string | number): string {
    const date = new Date(dateInput);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  }

  function handleRedirect(href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, [contentRef]);

  return (
    <section
      id={id}
      onClick={() => {
        if (notification.actionUrl) {
          handleRedirect(notification.actionUrl);
        } else {
          if (isMobile() && !open) onOpen?.(notification.id);
        }
      }}
      className={cn(
        "relative flex flex-col gap-1 p-3 rounded-md border-1 duration-200",
        open ? "border-primary-300" : "border-gray-100 hover:bg-[#E7F8EA]"
      )}
    >
      <h1 className="text-gray-500 text-xs leading-[1.125rem] text-start">{notification.title}</h1>
      <hr className="text-gray-200" />
      <p className="text-gray-700 text-sm leading-5 text-start">{notification.summary}</p>

      <div className="relative flex duration-300 overflow-clip" style={{ height: open ? contentHeight : 0 }}>
        <div ref={contentRef} className="absolute prose markdown">
          <Markdown>{notification.content}</Markdown>
        </div>
      </div>

      <span className="flex w-full text-[10px] leading-[18px] text-right text-gray-400 justify-end">
        {formatDate(notification.receivedAt)}
      </span>

      <button
        className="w-fit text-xs leading-[18px] text-gray-400 text-start cursor-pointer underline"
        onClick={() =>
          notification.actionUrl
            ? handleRedirect(notification.actionUrl)
            : open
            ? onClose?.(notification.id)
            : onOpen?.(notification.id)
        }
      >
        Ver {open && !notification.actionUrl ? "menos" : "mais"}
      </button>

      {!notification.read && (
        <div
          className="absolute right-0 top-0 -translate-y-1/3 rounded-full size-2"
          style={{ backgroundColor: notification.notificationType.color }}
        />
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";

interface NotificationCardProps {
  notification: Notification;
  id?: string;
  open?: boolean;
  onClose?: (id: string) => void;
  onOpen?: (id: string) => void;
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

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, [contentRef]);

  return (
    <section
      className={cn(
        "relative flex flex-col gap-1 p-3 rounded-md border-1 duration-200",
        open ? "border-primary-300" : "border-border-100 hover:bg-background-50"
      )}
      id={id}
    >
      <h1 className="text-text-500 text-xs leading-[1.125rem] text-start">{notification.title}</h1>
      <hr className="text-text-200" />
      <p className="text-text-700 text-sm leading-5 text-start">{notification.summary}</p>

      <div className="relative flex duration-300 overflow-clip" style={{ height: open ? contentHeight : 0 }}>
        <div
          ref={contentRef}
          className={cn("absolute flex w-full", {
            "justify-center": notification.actionUrl,
          })}
        >
          {notification.actionUrl ? (
            <Link href={notification.actionUrl}>
              <Button className="mt-4" size="lg" variant="secondary">
                Ir para detalhes
              </Button>
            </Link>
          ) : (
            <div className="markdown prose lg:prose-xl">
              <Markdown>{notification.content}</Markdown>
            </div>
          )}
        </div>
      </div>

      <span className="flex w-full text-[10px] leading-[18px] text-right text-text-400 justify-end">
        {formatDate(notification.receivedAt)}
      </span>

      <button
        className="w-fit text-xs leading-[18px] text-text-400 text-start cursor-pointer underline"
        onClick={() => (open ? onClose?.(notification.id) : onOpen?.(notification.id))}
      >
        Ver {open ? "menos" : "mais"}
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

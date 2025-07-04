"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Alert, Notification, NotificationFull } from "../definitions";
import { AlertCard } from "./alert-card";
import { NotificationCard } from "./notification-card";

interface NotificationsListProps {
  alerts: Alert[];
  notifications: Notification[];
  current?: NotificationFull;
}

export function NotificationsAccordion({ notifications, alerts, current }: NotificationsListProps) {
  const [openItem, setOpenItem] = useState<string | null>(current?.id ?? null);

  useEffect(() => {
    if (current) {
      document.getElementById(current.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [current]);

  if (!(notifications.length + alerts.length)) {
    return (
      <div className="flex size-full justify-center items-center">
        <p className="text-center text-text-500">
          Nada por aqui ainda...
          <br />
          Te avisamos assim que chegar algo novo!
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col pt-1.5 gap-3 overflow-scroll w-full scrollbar-hide")}>
      {alerts
        .toSorted((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((alerts) => {
          const isCurrent = alerts.id === current?.id;
          if (isCurrent) {
            alerts.read = true;
          }

          return (
            <AlertCard
              key={alerts.id}
              alert={alerts}
              id={alerts.id}
              open={alerts.id === openItem}
              onClose={(id) => setOpenItem((prev) => (prev === id ? null : prev))}
              onOpen={(id) => setOpenItem(id)}
            />
          );
        })}

      {notifications
        .toSorted(
          (a, b) =>
            b.notificationType.priority - a.notificationType.priority ||
            new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
        )
        .map((notification) => {
          const isCurrent = notification.id === current?.id;
          if (isCurrent) {
            notification.read = true;
          }

          return (
            <NotificationCard
              key={notification.id}
              id={notification.id}
              notification={notification}
              open={notification.id === openItem}
              onClose={(id) => setOpenItem((prev) => (prev === id ? null : prev))}
              onOpen={(id) => setOpenItem(id)}
            />
          );
        })}
    </div>
  );
}

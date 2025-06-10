"use client";

import { Alert, Notification, NotificationFull } from "../definitions";
import { cn } from "@/lib/utils";
import { NotificationCard } from "./notification-card";
import { useEffect, useState } from "react";
import { AlertCard } from "./alert-card";

interface NotificationsListProps {
  notifications: Notification[];
  alerts: Alert[];
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
        <p className="text-center text-gray-500">
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
              id={alerts.id}
              key={alerts.id}
              alert={alerts}
              open={alerts.id === openItem}
              onOpen={(id) => setOpenItem(id)}
              onClose={(id) => setOpenItem((prev) => (prev === id ? null : prev))}
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
              id={notification.id}
              key={notification.id}
              notification={notification}
              open={notification.id === openItem}
              onOpen={(id) => setOpenItem(id)}
              onClose={(id) => setOpenItem((prev) => (prev === id ? null : prev))}
            />
          );
        })}
    </div>
  );
}

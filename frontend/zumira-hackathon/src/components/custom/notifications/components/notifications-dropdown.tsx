"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Notification } from "../definitions";
import { NotificationCard } from "../notification-card";

interface NotificationsDropdownProps {
  data: Notification[];
  onClose: () => void;
}

export function NotificationsDropdown({ data, onClose }: NotificationsDropdownProps) {
  return (
    <>
      <div className="inset-0 fixed bg-gray-500/60 z-40" onClick={onClose} />
      <div className="absolute flex flex-col gap-3 right-0 top-14 shadow-2xl bg-white border border-gray-200 w-60 px-5 py-4 z-40 rounded-lg overflow-scroll max-h-[25rem]">
        {data.length ? (
          data
            .toSorted(
              (a, b) =>
                b.notificationType.priority - a.notificationType.priority ||
                new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
            )
            .slice(0, 2)
            .map((notification, index) => (
              <Fragment key={index}>
                {index !== 0 && <hr className="text-gray-200" />}
                <NotificationCard notification={notification} />
              </Fragment>
            ))
        ) : (
          <span className="text-base text-gray-500 text-center">Sem novas notificações</span>
        )}
        <Link className="text-sm text-primary-700 underline text-center" href="/notificacoes" onClick={onClose}>
          Ver todas
        </Link>
      </div>
    </>
  );
}

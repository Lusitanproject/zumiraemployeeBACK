"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Notification } from "../definitions";

interface NotificationsDropdownProps {
  data: Notification[];
  onClose: () => void;
}

export function NotificationsDropdown({ data, onClose }: NotificationsDropdownProps) {
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
                <Link href={`/notificacoes/${notification.id}`}>
                  <section
                    key={index}
                    className="relative flex flex-col gap-1 p-3 rounded-md bg-gray-100 hover:bg-gray-200"
                  >
                    <h1 className="text-gray-500 text-xs leading-[1.125rem] text-start">{notification.title}</h1>
                    <hr className="text-gray-200" />
                    <p className="text-gray-700 text-sm leading-5 text-start">{notification.summary}</p>
                    <span className="flex w-full text-[10px] leading-[18px] text-right text-gray-400 justify-end">
                      {formatDate(notification.receivedAt)}
                    </span>
                    <span className="w-full text-xs leading-[18px] underline text-gray-400 text-star">Ver mais</span>

                    <div
                      className="absolute right-0 top-0 -translate-y-1/2 rounded-full size-2"
                      style={{ backgroundColor: notification.notificationType.color }}
                    />
                  </section>
                </Link>
              </Fragment>
            ))
        ) : (
          <span className="text-base text-gray-500">Sem novas notificações</span>
        )}
        <Link className="text-sm text-primary-700 underline text-center" href="/notificacoes">
          Ver todas
        </Link>
      </div>
    </>
  );
}

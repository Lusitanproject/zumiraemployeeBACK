import { Mail } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";

interface NotificationCardProps {
  data: Notification;
}

export function NotificationCard({ data }: NotificationCardProps) {
  return (
    <Link
      className={cn("relative rounded-xl bg-background-100 p-[1.375rem] flex flex-col h-[12.375rem]")}
      href={`/admin/notificacoes/${data.id}`}
    >
      <div
        className="absolute rounded-full size-3 right-0 top-0 -translate-x-4 translate-y-4"
        style={{ backgroundColor: data.notificationType.color }}
      />
      <div className="flex w-full mb-3">
        <div className="flex items-center justify-center bg-primary-50 rounded-xl w-[50px] h-[50px]">
          <Mail className="size-6 text-text-700" />
        </div>
      </div>
      <span className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-base font-medium text-text-700 mb-3">
        {data.title}
      </span>
      <p className="w-full h-14 text-xs leading-[18px] text-ellipsis overflow-hidden text-text-500">{data.summary}</p>
    </Link>
  );
}

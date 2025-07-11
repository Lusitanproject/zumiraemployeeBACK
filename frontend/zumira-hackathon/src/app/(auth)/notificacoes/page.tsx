import { redirect } from "next/navigation";

import { getAlerts } from "@/api/alerts";
import { detailNotification, getNotifications } from "@/api/notifications";

import { NotificationsAccordion } from "./components/notifications-accordion";

export default async function Notificacoes({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const { id: notificationId } = await searchParams;
  const notifications = await getNotifications();
  const alerts = await getAlerts();
  let current;

  if (notificationId) {
    current = await detailNotification(notificationId);
    if (!current) {
      redirect("/notificacoes");
    }
  }

  return (
    <div className="flex flex-row size-full gap-8 py-1.5">
      <div className="flex size-full">
        <NotificationsAccordion alerts={alerts} current={current} notifications={notifications} />
      </div>
    </div>
  );
}

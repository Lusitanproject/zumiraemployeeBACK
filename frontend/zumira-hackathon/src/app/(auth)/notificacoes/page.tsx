import { getNotifications, getAlerts } from "./actions";
import { NotificationsAccordion } from "./components/notifications-accordion";
import { detailNotification } from "@/components/custom/notifications/actions";
import { redirect } from "next/navigation";

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
        <NotificationsAccordion notifications={notifications} alerts={alerts} current={current} />
      </div>
    </div>
  );
}

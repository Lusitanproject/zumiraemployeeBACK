import { getNotifications } from "./actions";
import { NotificationsAccordion } from "./components/notifications-accordion";
import { detailNotification } from "@/components/custom/notifications/actions";
import { redirect } from "next/navigation";

export default async function Notificacoes({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const { id: notificationId } = await searchParams;
  const notifications = await getNotifications();
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
        <NotificationsAccordion data={notifications} current={current} />
      </div>
    </div>
  );
}

import { Notification } from "../definitions";
import { NotificationCard } from "./notification-card";

type NotificationListProps = {
  data: Notification[];
};

export function NotificationList({ data }: NotificationListProps) {
  if (!data.length) {
    return <></>;
  }

  function sortNotifications(a: Notification, b: Notification) {
    const colorA = parseInt(a.notificationType.color.replace("#", ""), 16);
    const colorB = parseInt(b.notificationType.color.replace("#", ""), 16);
    return colorA - colorB;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 py-4">
      {data.toSorted(sortNotifications).map((item) => (
        <NotificationCard key={item.id} data={item} />
      ))}
    </div>
  );
}

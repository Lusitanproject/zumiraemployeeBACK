import { getNotifications, getAlerts } from "./actions";
import { NotificationsButton } from "./components/notifications-button";

export async function Notifications() {
  const notifications = await getNotifications();
  const alerts = await getAlerts();

  return <NotificationsButton notifications={notifications} alerts={alerts} />;
}

import { getAlerts } from "@/api/alerts";
import { getNotifications } from "@/api/notifications";

import { NotificationsButton } from "./components/notifications-button";

export async function Notifications() {
  const notifications = await getNotifications();
  const alerts = await getAlerts();

  return <NotificationsButton alerts={alerts} notifications={notifications} />;
}

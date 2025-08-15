import { getAlerts } from "@/api/alerts";
import { getNotifications } from "@/api/notifications";

import { NotificationsButton } from "./components/notifications-button";

export async function Notifications() {
  const [notifications, alerts] = await Promise.all([
    getNotifications({ filter: "recent", max: 10 }),
    getAlerts({ filter: "recent", max: 10 }),
  ]);

  return <NotificationsButton alerts={alerts} notifications={notifications} />;
}

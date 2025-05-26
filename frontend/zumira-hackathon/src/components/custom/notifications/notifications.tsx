import { getNotifications } from "./actions";
import { NotificationsButton } from "./components/notifications-button";

export async function Notifications() {
  const notifications = await getNotifications();

  return <NotificationsButton data={notifications} />;
}

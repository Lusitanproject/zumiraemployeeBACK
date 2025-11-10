import { Alert } from "@/types/alert";
import { Notification } from "@/types/notification";

import { NotificationsButton } from "./components/notifications-button";

interface NotificationsProps {
  alerts: Alert[];
  notifications: Notification[];
}

export function Notifications({ notifications, alerts }: NotificationsProps) {
  return <NotificationsButton alerts={alerts} notifications={notifications} />;
}

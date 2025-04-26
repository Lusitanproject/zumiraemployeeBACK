import { Header } from "../components/header";
import { getNotifications } from "./actions";
import { NotificationList } from "./components/notification-list";

export default async function Notificacoes() {
  const notifications = await getNotifications();

  return (
    <div className="flex flex-col">
      <div className="w-full pb-8 [&:not(:last-child)]:border-b border-gray-200 mb-8">
        <Header title="Notificações" create={{ text: "Nova notificação", href: "/admin/notificacoes/novo" }} />
        <NotificationList data={notifications} />
      </div>
    </div>
  );
}

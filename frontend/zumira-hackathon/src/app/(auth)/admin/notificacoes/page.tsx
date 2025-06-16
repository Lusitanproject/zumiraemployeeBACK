import { Header } from "../components/header";
import { getNotifications, getNotificationTypes } from "./actions";
import { CategoryList } from "./components/category-list";
import { NotificationList } from "./components/notification-list";

export default async function Notificacoes() {
  const notifications = await getNotifications();
  const types = await getNotificationTypes();

  return (
    <div className="flex flex-col size-full gap-4">
      <div className="w-full pb-8 border-gray-200">
        <Header create={{ text: "Nova notificação", href: "/admin/notificacoes/novo" }} title="Notificações" />
        <NotificationList data={notifications} />
      </div>
      <div className="w-full pb-8 border-gray-200 mb-8">
        <Header create={{ text: "Nova categoria", href: "/admin/notificacoes/categorias/novo" }} title="Categorias" />
        <CategoryList data={types} />
      </div>
    </div>
  );
}

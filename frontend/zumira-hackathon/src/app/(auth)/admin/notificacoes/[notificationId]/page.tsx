import { detailNotification, getNotificationTypes } from "@/api/notifications";
import { getUsers } from "@/api/users";

import { NotificationForm } from "./form";

// TODO: Definir em que momento serao selecionados os usuarios que recebem a notificacao

export default async function ManageDimension({ params }: { params: Promise<{ notificationId: string }> }) {
  const id = (await params).notificationId;
  const notification = id === "novo" ? null : await detailNotification(id);
  const types = await getNotificationTypes();
  const users = await getUsers();

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-4 border-b border-border-100">
        <h3 className="font-bold text-2xl text-text-700">{id === "novo" ? "Nova " : "Editar "}Notificação</h3>
      </div>
      <NotificationForm data={notification} types={types} users={users} />
    </div>
  );
}

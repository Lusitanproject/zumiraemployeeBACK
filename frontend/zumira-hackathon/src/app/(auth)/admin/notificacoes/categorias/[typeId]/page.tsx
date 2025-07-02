import { getNotificationType } from "./actions";
import { NotificationTypeForm } from "./form";

export default async function ManageDimension({ params }: { params: Promise<{ typeId: string }> }) {
  const id = (await params).typeId;
  const notification = await getNotificationType(id === "novo" ? null : id);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-4 border-b border-border-100">
        <h3 className="font-bold text-2xl text-text-700">{id === "novo" ? "Nova " : "Editar "}Notificação</h3>
      </div>
      <NotificationTypeForm data={notification} />
    </div>
  );
}

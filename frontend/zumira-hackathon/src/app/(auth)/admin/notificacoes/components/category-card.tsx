import Link from "next/link";
import { cn } from "@/lib/utils";
import { NotificationType } from "../definitions";

interface CategoryCardProps {
  data: NotificationType;
}

export function CategoryCard({ data }: CategoryCardProps) {
  return (
    <Link
      href={`/admin/notificacoes/categorias/${data.id}`}
      className={cn("rounded-xl bg-gray-100 p-4 flex flex-row items-center h-fit")}
    >
      <div className="flex flex-row gap-2 w-full">
        <div
          className="flex items-center justify-center rounded-lg size-6 flex-none"
          style={{ backgroundColor: data.color }}
        />
        <span className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-base font-medium">
          {data.name}
        </span>
      </div>
    </Link>
  );
}

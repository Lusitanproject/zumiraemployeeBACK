import { User } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type AssessmentCardProps = {
  id: string;
  title: string;
  summary: string;
};

export function AssessmentCard({ id, title, summary }: AssessmentCardProps) {
  return (
    <Link
      className={cn("rounded-xl bg-gray-100 p-[1.375rem] flex flex-col h-[12.375rem]")}
      href={`/admin/testes/${id}`}
    >
      <div className="flex w-full mb-3">
        <div className="flex items-center justify-center bg-primary-50 rounded-xl w-[50px] h-[50px]">
          <User className="size-6" />
        </div>
      </div>
      <span className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-base font-medium mb-3">{title}</span>
      <p className="w-full h-14 text-xs leading-[18px] text-ellipsis overflow-hidden">{summary}</p>
    </Link>
  );
}

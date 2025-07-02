import { Earth } from "lucide-react";
import Link from "next/link";

import { Nationality } from "@/types/nationality";

export type CardProps = {
  data: Nationality;
};

export function NationalityCard({ data }: CardProps) {
  return (
    <Link className="p-[1.375rem] rounded-xl bg-background-100" href={`/admin/nacionalidades/${data.id}`}>
      <div className="flex h-[50px] justify-start mb-3">
        <div className="w-[50px] h-[50px] rounded-xl bg-primary-50 flex items-center justify-center font-bold">
          <Earth className="size-5 text-text-700" />
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-text-700 mb-1">{data.name}</h3>
        <span className="text-sm font-medium text-text-600 mb-3">{data.acronym}</span>
      </div>
    </Link>
  );
}

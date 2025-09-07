import { Earth, Footprints } from "lucide-react";
import Link from "next/link";

import { Nationality } from "@/types/nationality";
import { Trail } from "@/types/trail";

export type CardProps = {
  data: Trail;
};

export function TrailCard({ data }: CardProps) {
  return (
    <Link className="p-[1.375rem] rounded-xl bg-background-100" href={`/admin/trilhas/${data.id}`}>
      <div className="flex h-[50px] justify-start mb-3">
        <div className="w-[50px] h-[50px] rounded-xl bg-primary-50 flex items-center justify-center font-bold">
          <Footprints className="size-5 text-text-700" />
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-text-700 mb-1">{data.title}</h3>
        <span className="text-sm font-medium text-text-600 mb-3">{data.subtitle}</span>
      </div>
    </Link>
  );
}

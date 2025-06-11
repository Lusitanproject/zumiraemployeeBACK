import { Brain } from "lucide-react";
import Link from "next/link";

import { Dimension } from "../definitions";

export type CardProps = {
  data: Dimension;
};

export function DimensionCard({ data }: CardProps) {
  return (
    <Link className="p-[1.375rem] rounded-xl bg-gray-100" href={`/admin/dimensoes/${data.id}`}>
      <div className="flex h-[50px] justify-start mb-3">
        <div className="w-[50px] h-[50px] rounded-xl bg-primary-50 flex items-center justify-center font-bold">
          <Brain className="size-5" />
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-gray-700 mb-1">
          {data.acronym} - {data.name}
        </h3>
        <span className="text-sm font-medium text-gray-600 mb-3">{data.selfMonitoringBlock.title}</span>
      </div>
    </Link>
  );
}

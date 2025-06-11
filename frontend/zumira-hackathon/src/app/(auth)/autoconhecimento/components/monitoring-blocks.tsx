"use client";
import { startHolyLoader } from "holy-loader";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { SelfMonitoringBlock } from "../definitions";
import { Badge } from "./badge";

type MonitoringBlocksProps = {
  data: SelfMonitoringBlock[];
};

export function MonitoringBlocks({ data }: MonitoringBlocksProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const selfMonitoring = searchParams.get("avaliacao");
  const [selectedId, setSelectedId] = useState<string | null>(selfMonitoring);

  const handleSelect = (monitoringId: string) => {
    startHolyLoader();

    const params = new URLSearchParams(searchParams);

    if (monitoringId === selfMonitoring) {
      setSelectedId(null);
      params.delete("avaliacao");
    } else {
      setSelectedId(monitoringId);
      params.set("avaliacao", monitoringId);
      params.delete("busca");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-nowrap overflow-x-auto gap-x-3 mb-8 scrollbar-hide">
      {data.map((item) => (
        <Badge
          key={item.id}
          className={cn("hover:bg-primary-25/70", { "hover:bg-gray-200": selectedId !== item.id })}
          selected={selectedId === item.id}
          onClick={() => handleSelect(item.id)}
        >
          <span>{item.title}</span>
          {selectedId === item.id && <X className="size-3 text-primary-500" />}
        </Badge>
      ))}
    </div>
  );
}

"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
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

  const handleSelect = (monitoringId: string) => {
    const params = new URLSearchParams(searchParams);

    if (monitoringId === selfMonitoring) {
      params.delete("avaliacao");
    } else {
      params.set("avaliacao", monitoringId);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-nowrap overflow-x-auto gap-x-3 mb-8 scrollbar-hide">
      {data.map((item) => (
        <Badge key={item.id} selected={selfMonitoring === item.id} onClick={() => handleSelect(item.id)}>
          <span>{item.title}</span>
          {selfMonitoring === item.id && <X className="size-3 text-primary-500" />}
        </Badge>
      ))}
    </div>
  );
}

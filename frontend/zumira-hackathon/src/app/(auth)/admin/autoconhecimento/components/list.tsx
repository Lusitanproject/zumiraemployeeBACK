import { IconName } from "@/components/custom/icon";
import { MonitoringBlock } from "../definitions";
import { Card } from "./card";

type MonitoringBlocksListProps = {
  data: MonitoringBlock[];
};

export function BlocksList({ data }: MonitoringBlocksListProps) {
  if (!data) {
    return <></>;
  }

  return (
    <div className="flex flex-col py-4">
      <div className="grid grid-cols-2 gap-2.5">
        {data.map((item) => (
          <Card key={item.id} id={item.id} title={item.title} summary={item.summary} icon={item.icon as IconName} />
        ))}
      </div>
    </div>
  );
}

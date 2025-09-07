import { Nationality } from "@/types/nationality";

import { TrailCard } from "./trail-card";
import { Trail } from "@/types/trail";

type TrailListProps = {
  data: Trail[];
};

export function TrailList({ data }: TrailListProps) {
  if (!data) {
    return <></>;
  }

  return (
    <div className="flex flex-col py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.map((item) => (
          <TrailCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}

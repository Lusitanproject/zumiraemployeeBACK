import { Dimension } from "../definitions";
import { DimensionCard } from "./dimension-card";

type DimensionListProps = {
  data: Dimension[];
};

export function DimensionList({ data }: DimensionListProps) {
  if (!data) {
    return <></>;
  }

  return (
    <div className="flex flex-col py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.map((item) => (
          <DimensionCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}

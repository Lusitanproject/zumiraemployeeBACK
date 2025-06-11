import { Nationality } from "@/types/nationality";

import { NationalityCard } from "./nationality-card";

type NationalityListProps = {
  data: Nationality[];
};

export function NationalityList({ data }: NationalityListProps) {
  if (!data) {
    return <></>;
  }

  return (
    <div className="flex flex-col py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.map((item) => (
          <NationalityCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}

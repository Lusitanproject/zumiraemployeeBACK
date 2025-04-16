import { Company } from "../definitions";
import { CompanyCard } from "./company-card";

type CompanyListProps = {
  data: Company[];
};

export function CompaniesList({ data }: CompanyListProps) {
  if (!data) {
    return <></>;
  }

  return (
    <div className="flex flex-col py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.map((item) => (
          <CompanyCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}

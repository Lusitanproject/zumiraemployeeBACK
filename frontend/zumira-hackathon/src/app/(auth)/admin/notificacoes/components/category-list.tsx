import { NotificationType } from "../definitions";
import { CategoryCard } from "./category-card";

type CategoryListProps = {
  data: NotificationType[];
};

export function CategoryList({ data }: CategoryListProps) {
  if (!data.length) {
    return <></>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 py-4">
      {data.map((item) => (
        <CategoryCard key={item.id} data={item} />
      ))}
    </div>
  );
}

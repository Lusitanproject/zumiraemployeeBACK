import { ActsList } from "./components/list";
import { getTrailsAdmin } from "@/api/trails";

export default async function Atos({ searchParams }: { searchParams: { trailId?: string } }) {
  const trails = await getTrailsAdmin();
  const trailId = searchParams.trailId ?? trails[0]?.id;

  return (
    <div className="flex flex-col w-full">
      <ActsList trailId={trailId} trails={trails} />
    </div>
  );
}

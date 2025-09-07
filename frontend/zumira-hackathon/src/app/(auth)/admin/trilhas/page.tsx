import { getTrailsAdmin } from "@/api/trails";
import { Header } from "../components/header";
import { TrailList } from "./components/trail-list";

export default async function Dimensoes() {
  const trails = await getTrailsAdmin();

  return (
    <div className="flex flex-col w-full">
      <Header create={{ text: "Nova trilha", href: "/admin/trilhas/novo" }} title="Trilhas" />
      <TrailList data={trails} />
    </div>
  );
}

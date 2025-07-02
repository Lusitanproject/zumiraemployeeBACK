import { getNationalityData } from "./actions";
import { NationalityForm } from "./form";

export default async function ManageNationality({ params }: { params: Promise<{ nationalityId: string }> }) {
  const id = (await params).nationalityId;
  const nationality = await getNationalityData(id === "novo" ? null : id);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-4 border-b border-border-100">
        <h3 className="font-bold text-2xl text-text-700">{id === "novo" ? "Novo " : "Editar "}Nacionalidade</h3>
      </div>
      <NationalityForm data={nationality} />
    </div>
  );
}

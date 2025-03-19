import { getDimensionData, getMonitoringBlocks } from "./actions"
import { DimensionForm } from "./form"

export default async function ManageDimension({
  params
}: { params: Promise<{ dimensionId: string }> }) {
  const id = (await params).dimensionId
  const dimension = await getDimensionData(id === "novo" ? null : id)
  const blocks = await getMonitoringBlocks()

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <h3 className="font-bold text-2xl text-gray-700">{id === "novo" ? "Novo " : "Editar "}Dimensão psicológica</h3>
      </div>
      <DimensionForm
        data={dimension}
        blocks={blocks}
      />
    </div>
  )
}

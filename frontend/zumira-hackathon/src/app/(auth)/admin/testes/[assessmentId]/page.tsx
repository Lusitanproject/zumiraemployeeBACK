import { getMonitoringBlocks } from "../../automonitoramento/actions"
import { getAssessmentData } from "./actions"
import { AssessmentForm } from "./form"

export default async function ManageAssessment({
  params
}: { params: Promise<{ assessmentId: string }> }) {
  const assessmentId = (await params).assessmentId
  const data = await getAssessmentData(assessmentId === "novo" ? null : assessmentId)
  const { data: blocks } = await getMonitoringBlocks()

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <h3 className="font-bold text-2xl text-gray-700">{assessmentId === "novo" ? "Novo " : "Editar "}Teste</h3>
      </div>
      <AssessmentForm data={data} blocks={blocks} />
    </div>
  )
}
